# This is used to predicte to the data without label. 
# Output Example -- Sha256: 4f913360e14c5da32ff2d2f1cf1a1e788448d1d1b7eed1810da5fac4cf80aca1, Prediction: 0
# command: 	spark-submit \
# 			--master spark://master:7077 --py-files /FolderPath/prediction_sha256_dist.py \
# 			--conf spark.cores.max=3 --conf spark.task.cpus=1 \
#			--conf spark.executorEnv.JAVA_HOME="$JAVA_HOME" --conf spark.executorEnv.LD_LIBRARY_PATH="${JAVA_HOME}/jre/lib/amd64/server" \
#			--conf spark.executorEnv.CLASSPATH="$($HADOOP_HOME/bin/hadoop classpath --glob):${CLASSPATH}" \
#			/FolderPath/prediction_sha256_spark.py \
#			--cluster_size 3 --input "HDFS_PARQUET_DATA" --mode inference --model HDFS_PATH_MODEL --output HDFS_PATH_OUTPUT

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
import prediction_sha256_dist

sc = SparkContext(conf=SparkConf().setAppName("NN_prediction_sha256"))
sqlContext = SQLContext(sc)
executors = sc._conf.get("spark.executor.instances")
num_executors = int(executors) if executors is not None else 1
num_ps = 1

parser = argparse.ArgumentParser()
parser.add_argument("-i", "--input", help="HDFS path to dataRDD in parquet format", default= "8_12_VT_peinfo_objdump_join.parquet")
parser.add_argument("-o", "--output", help="HDFS path to save inference output", default="predictions")
parser.add_argument("-m", "--model", help="HDFS path to load model during inference", default="NN_model")
parser.add_argument("-n", "--cluster_size", help="number of nodes in the cluster", type=int, default=num_executors)
parser.add_argument("-b", "--batch_size", help="number of records per batch", type=int, default=1)
args = parser.parse_args()
print("args:",args)
print("{0} ===== Start".format(datetime.now().isoformat()))

datafile = sqlContext.read.format("parquet").load(args.input)
sha256RDD= datafile.rdd.map(lambda row: row._1)
featureRDD = datafile.rdd.map(lambda row: row._2._2)
dataRDD = featureRDD.zip(sha256RDD)	

cluster = TFCluster.run(sc, prediction_sha256_dist.map_fun, args, args.cluster_size, num_ps, False, TFCluster.InputMode.SPARK)

predictionRDD = cluster.inference(dataRDD)
predictionRDD.saveAsTextFile(args.output)
cluster.shutdown()

print("{0} ===== Stop".format(datetime.now().isoformat()))

