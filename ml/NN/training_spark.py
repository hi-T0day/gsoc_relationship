# This is used to 1/train the model from the labeled data 2/predict the label of the labeled data. 
# 1) train the model from the labeled data
# command: 	spark-submit \
# 			--master spark://master:7077 --py-files /FolderPath/training_dist.py \
# 			--conf spark.cores.max=3 --conf spark.task.cpus=1 \
#			--conf spark.executorEnv.JAVA_HOME="$JAVA_HOME" --conf spark.executorEnv.LD_LIBRARY_PATH="${JAVA_HOME}/jre/lib/amd64/server" \
#			--conf spark.executorEnv.CLASSPATH="$($HADOOP_HOME/bin/hadoop classpath --glob):${CLASSPATH}" \
#			/FolderPath/training_spark.py \
#			--cluster_size 3 --input "HDFS_PARQUET_DATA" --mode train --model HDFS_PATH_MODEL 

# 2) predict the label of the labeled data
# Output Example -- Label: 0, Prediction: 0
# command: 	spark-submit \
# 			--master spark://master:7077 --py-files /FolderPath/prediction_sha256_dist.py \
# 			--conf spark.cores.max=3 --conf spark.task.cpus=1 \
#			--conf spark.executorEnv.JAVA_HOME="$JAVA_HOME" --conf spark.executorEnv.LD_LIBRARY_PATH="${JAVA_HOME}/jre/lib/amd64/server" \
#			--conf spark.executorEnv.CLASSPATH="$($HADOOP_HOME/bin/hadoop classpath --glob):${CLASSPATH}" \
#			/FolderPath/prediction_sha256_spark.py \
#			--batch_size 1 --cluster_size 3 --input "HDFS_PARQUET_DATA" --mode inference --model HDFS_PATH_MODEL --output HDFS_PATH_OUTPUT

# Tips: Code is based on the TensorflowOnSpark(TFoS) mnist example.

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

from pyspark.context import SparkContext
from pyspark.conf import SparkConf
from pyspark.sql import SQLContext

import argparse
import os
import numpy
import sys
import tensorflow as tf
import threading
import time
from datetime import datetime

from tensorflowonspark import TFCluster
import training_dist

sc = SparkContext(conf=SparkConf().setAppName("NN_training_spark"))
sqlContext = SQLContext(sc)
executors = sc._conf.get("spark.executor.instances")
num_executors = int(executors) if executors is not None else 1
num_ps = 1

parser = argparse.ArgumentParser()
parser.add_argument("-X", "--mode", help="train|inference", default="train")
parser.add_argument("-i", "--input", help="HDFS path to dataRDD in parquet format", default= "8_12_VT_peinfo_objdump_join.parquet")
parser.add_argument("-m", "--model", help="HDFS path to save/load model during train/inference", default="NN_model")
parser.add_argument("-o", "--output", help="HDFS path to save inference output", default="predictions")
parser.add_argument("-b", "--batch_size", help="number of records per batch", type=int, default=10)
parser.add_argument("-e", "--epochs", help="number of epochs", type=int, default=1)
parser.add_argument("-s", "--steps", help="maximum number of steps", type=int, default=10000)
parser.add_argument("-n", "--cluster_size", help="number of nodes in the cluster", type=int, default=num_executors)

args = parser.parse_args()
print("args:",args)
print("{0} ===== Start".format(datetime.now().isoformat()))

datafile = sqlContext.read.format("parquet").load(args.input)
labelRDD= datafile.rdd.map(lambda row: row._2._1)
featureRDD = datafile.rdd.map(lambda row: row._2._2)
dataRDD = featureRDD.zip(labelRDD)

cluster = TFCluster.run(sc, training_dist.map_fun, args, args.cluster_size, num_ps, False, TFCluster.InputMode.SPARK)
if args.mode == "train":
  cluster.train(dataRDD, args.epochs)
else:
  labelRDD = cluster.inference(dataRDD)
  labelRDD.saveAsTextFile(args.output)
cluster.shutdown()

print("{0} ===== Stop".format(datetime.now().isoformat()))

