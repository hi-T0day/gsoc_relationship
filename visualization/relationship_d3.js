treeJSON = d3.json("example_data.json", function(error, treeData) {
    var totalNodes = 0;
    var maxLabelLength = 0;
    var i = 0;
    var duration = 750;
    var root
    var len = 0
    var newroot = {}
    var viewerWidth = $(document).width();
    var viewerHeight = $(document).height();
    var allFeatures = treeData.all_features
    var allFeaturesInLoop = treeData.all_features    
    var deleteFeatues = []
    var chartflag = 0

    var tree = d3.layout.tree()
        .size([viewerHeight, viewerWidth]);
    var diagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.y, d.x];
        });

    function visit(parent, visitFn, childrenFn) {
        if (!parent) return;
        visitFn(parent);
        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                visit(children[i], visitFn, childrenFn);
            }
        }
    }

    visit(treeData, function(d) {
        totalNodes++;
        maxLabelLength = Math.max(d.name.length, maxLabelLength);

    }, function(d) {
        return d.children && d.children.length > 0 ? d.children : null;
    });

    function sortTree() {
        tree.sort(function(a, b) {
            if (a.final_score == b.final_score){
                return b.name.toString().toLowerCase() < a.name.toString().toLowerCase() ? 1 : -1;
            }
            return b.final_score > a.final_score ? 1 : -1;
        });
    }
    sortTree();

    function zoom() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    var zoomListener = d3.behavior.zoom().scaleExtent([0, 3]).on("zoom", zoom);

    var baseSvg = d3.select("#relationship-container").append("svg")
        .attr("width", viewerWidth)
        .attr("height", viewerHeight)
        .attr("class", "overlay")
        .call(zoomListener);

    function centerNode(source) {
        scale = zoomListener.scale();
        x = -source.y0;
        y = -source.x0;
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + (x-viewerWidth/4) + "," + (y-20) + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }

    function toggleChildren(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        return d;
    }

    function click(d) {
        if (d3.event.defaultPrevented) return; 
        d = toggleChildren(d);
        update(d);
        centerNode(d);
    }

    function thresholdInitial(batch_node){
        if (batch_node.children_threshold || batch_node._children_threshold) {
            if (batch_node.children_threshold){
                if (!batch_node.children) {batch_node.children=[]}
                for (var i = 0; i < batch_node.children.length; i++){
                    thresholdInitial(batch_node.children[i])                    
                }
                for (var i = 0; i < batch_node.children_threshold.length ; i++){
                    batch_node.children.push(batch_node.children_threshold[i])
                    thresholdInitial(batch_node.children_threshold[i])
                }
                batch_node.children_threshold=null
            }
            if (batch_node._children_threshold){
                if (!batch_node._children) {batch_node._children=[]}
                for (var i = 0; i < batch_node._children.length; i++){
                    thresholdInitial(batch_node._children[i])                    
                }
                for (var j = 0; j < batch_node._children_threshold.length ; j++){
                    batch_node._children.push(batch_node._children_threshold[j])
                    thresholdInitial(batch_node._children_threshold[j])
                }
                batch_node._children_threshold=null
            }
        }
        else if (batch_node.children || batch_node._children){
            if (batch_node.children){
                for (var i = 0; i < batch_node.children.length ; i++){
                    thresholdInitial(batch_node.children[i])
                }
            }
            if (batch_node._children){
                 for (var i = 0; i < batch_node._children.length ; i++){
                    thresholdInitial(batch_node._children[i])
                }               
            }
        }
    }

    function thresholdChildren(batch_node,number) {
        if (batch_node.children || batch_node._children) {
            if (batch_node.children){
                batch_node.children_threshold = []
                for (var i = batch_node.children.length-1; i >=0 ; i--){
                    if (batch_node.children[i].final_score >= number) {
                        if (batch_node.children[i].children) {
                            thresholdChildren(batch_node.children[i],number)
                        }
                    }
                    else {
                        batch_node.children_threshold.splice(0,0, batch_node.children[i])
                        batch_node.children.splice(i,1)
                    }
                }
            }
            if (batch_node._children){
                batch_node._children_threshold = []
                for (var j = batch_node._children.length-1; j >=0 ; j--){
                    if (batch_node._children[j].final_score >= number) {
                        if (batch_node._children[j].children) {
                            thresholdChildren(batch_node._children[j],number)
                        }
                    }
                    else {
                        batch_node._children_threshold.splice(0,0, batch_node._children[j])
                        batch_node._children.splice(j,1)
                    }
                }
            }
        }
    }

    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };

    Array.prototype.findAll = function(val) {
        var flag = []
        for (var i = 0; i < this.length; i++) {
            if (this[i].name.toString() == val.name.toString()) {
                flag.push(i)
            }
        }
        return flag;
    };

    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    function deleteArtefact(name) {
        allFeaturesInLoop.remove(name)
        allFeaturesInLoop = allFeaturesInLoop.sort()
        var nodes = tree.nodes(root).reverse()
        nodes.forEach(function(d) {
            if (typeof(d.name)=="object"){
                if ($.inArray(name, d.name) >= 0) {
                    if (d.name.length == 1){
                        d.children = null
                        d.parent.children.remove(d)
                    }
                    else{
                        d.name.remove(name)
                    }
                } 
            }
        });
        update(root)
        nodes.forEach(function(d) {
            if (typeof(d.name)=="object"){
                if ( (d.name.toString() == d.parent.name.toString()) || (d.name.sort().toString() == allFeaturesInLoop.sort().toString()) ){
                    for (var i = 0; i < d.children.length; i++) {
                        d.parent.children.splice(-1,0,d.children[i]);
                    }
                    d.children = null
                    d.parent.children.remove(d)
                }
            }
        });
        update(root)
        nodes.forEach(function(d) {
            if (typeof(d.name)=="object" && d.children != null && d.parent.children != null){
                var sameNameLabel = d.parent.children.findAll(d)
                if (sameNameLabel.length > 1){
                    var sameMaxScore = d.parent.children[sameNameLabel[0]].final_score
                    for (var i = sameNameLabel.length-1 ; i >=1 ; i--){

                        if (d.parent.children[sameNameLabel[i]].final_score > sameMaxScore) {
                            sameMaxScore = d.parent.children[sameNameLabel[i]].final_score
                        }
                        for (var j =0; j < d.parent.children[sameNameLabel[i]].children.length; j++){
                            d.parent.children[sameNameLabel[0]].children.splice(-1,0,d.parent.children[sameNameLabel[i]].children[j])                           
                        }
                        d.parent.children[sameNameLabel[i]].children = null
                        d.parent.children.remove(d.parent.children[sameNameLabel[i]])
                    }
                    d.final_score = sameMaxScore
                }
            }
        });
        update(root)
    }

    function deleteArtefactLoop(name){
        root=clone(newroot);
        allFeaturesInLoop = treeData.all_features
        for (var i = 0; i < name.length; i++) {
            deleteArtefact(name[i])
        }
        update(root)  
    }

    function createChart(){

        var chartSvg = baseSvg.append("svg")
            .attr("class","chart")
            .attr("x",250)
            .attr("y",100)
            .attr("width", viewerWidth)
            .attr("height", viewerHeight)
            .attr("transform","translate(" + 0 + "," + 0 + ")")

        var scoreArray = [0]
        var nodes = tree.nodes(root).reverse()
        nodes.forEach(function(d) {
            if (!(d.children || d._children)){
                var newScore = (19 - Math.floor(d.final_score / 5))
                if (!scoreArray[newScore]){
                    scoreArray[newScore] = 0
                }
                scoreArray[newScore] = scoreArray[newScore] + 1
            }
        });

        var width = ($(document).width())/2.5;
        var height = ($(document).height())/1.5;
        var padding = {left:30, right:30, top:20, bottom:20};

        var axisName = []
        for(var i = 0; i < scoreArray.length; i++){
            axisName.push( (100-i*5).toString() + "-" + (95-i*5).toString())
        }

        var xScale = d3.scale.ordinal()
            .domain(d3.range(scoreArray.length))
            .rangeRoundBands([0, width - padding.left - padding.right]);        

        var xScaleName = d3.scale.ordinal()
            .domain(axisName)
            .rangeRoundBands([0, width - padding.left - padding.right]);

        var yScale = d3.scale.linear()
            .domain([0,d3.max(scoreArray)])
            .range([height - padding.top - padding.bottom, 0]);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");
           
        var xAxisName = d3.svg.axis()
            .scale(xScaleName)
            .orient("bottom");            

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");        

        var rectPadding = 4;

        var rects = chartSvg.selectAll(".MyRect")
            .data(scoreArray)
            .enter()
            .append("rect")
            .attr("class","MyRect")
            .attr("transform","translate(" + padding.left + "," + padding.top + ")")
            .attr("x", function(d,i){
                return xScale(i) + rectPadding/2;
            } )
            .attr("y",function(d){
                return yScale(d);
            })
            .attr("width", xScale.rangeBand() - rectPadding )
            .attr("height", function(d){
                return height - padding.top - padding.bottom - yScale(d);
            });

        var texts = chartSvg.selectAll(".MyText")
            .data(scoreArray)
            .enter()
            .append("text")
            .attr("class","MyText")
            .attr("transform","translate(" + padding.left + "," + padding.top + ")")
            .attr("x", function(d,i){
                return xScale(i) + rectPadding/2;
            } )
            .attr("y",function(d){
                return yScale(d);
            })
            .attr("dx",function(){
                return (xScale.rangeBand() - rectPadding)/2;
            })
            .attr("dy",function(d){
                return 20;
            })
            .text(function(d){
                return d;
            });

        chartSvg.append("g")
            .attr("class","axis")
            .attr("transform","translate(" + padding.left + "," + (height - padding.bottom) + ")")
            .call(xAxisName); 
            
        chartSvg.append("g")
            .attr("class","axis")
            .attr("transform","translate(" + padding.left + "," + padding.top + ")")
            .call(yAxis);
    }

    function update(source) {
        var levelWidth = [1];
        var childCount = function(level, n) {

            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function(d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        var newHeight = d3.max(levelWidth) * 30; 
        tree = tree.size([newHeight, viewerWidth]);

        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        var maxscore = 0
        var minscore = 100
        var maxMinScore = function(batch_node){
            if (batch_node.children && batch_node.children.length > 0){
                for (var i=0; i<batch_node.children.length;i++){
                    if ( batch_node.children[i].final_score > maxscore){
                        maxscore = batch_node.children[i].final_score
                    }
                    if (batch_node.children[i].final_score < minscore){
                        minscore = batch_node.children[i].final_score
                    }
                    if (batch_node.children[i].children && batch_node.children[i].children.length > 0){
                        maxMinScore(batch_node.children[i])
                    }
                }
            }
        }
        maxMinScore(root)
        var scoreRange = maxscore - minscore

        nodes.forEach(function(d) {
            d.y = (d.depth * (maxLabelLength * 8.5)); 
        });

        node = svgGroup.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });

        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on('click', click);

        nodeEnter.append("circle")
            .attr('class', 'nodeCircle')
            .attr("r", 0)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        nodeEnter.append("text")
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("dy", ".35em")
            .attr('class', 'nodeText')
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return d.name;
            })
            .style("fill-opacity", 0);

        node.select('text')
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return d.name;
            });

        node.select("circle.nodeCircle")
            .attr("r", 4.5)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 0);

        nodeExit.select("text")
            .style("fill-opacity", 0);

        var link = svgGroup.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });

        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            });

        link.transition()
            .duration(duration)
            .attr("d", diagonal)
            .style("stroke-width",function(d){
                return (d.target.final_score - minscore)/scoreRange*4 + 0.5
            });

        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });



        node.on("mouseover",function(d){
            if (!(d.children || d._children)){
            tooltip.html("Final score:" + d.final_score + "<br /> " + d.indicator_socre)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 20) + "px")
                .style("opacity",1.0);
            }
            else {
                if (d.children) {len = d.children.length} else {len = d._children.length}
            tooltip.html("Set type:" + d.name + "<br /> " + "Children Num:" + len + "<br /> " + "Max score:" + d.final_score + "<br /> ")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 20) + "px")
                .style("opacity",1.0);                
            }
        })
        .on("mousemove",function(d){            
            tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px");
        })
        .on("mouseout",function(d){            
            tooltip.style("opacity",0.0);
        });
    }

    var svgGroup = baseSvg.append("g");
                
    var thresholdText = baseSvg.append("foreignObject")
                            .attr("class", "externalObject")
                            .attr("width", 150)
                            .attr("height", 50)
                            .attr("transform",function(d){
                                return "translate(" + 10 + "," + 0 + ")";
                            })
                            .append("xhtml:div")
                            .html( "Final_score_threshold:" + "<input type='text' id=new_x1 value=0></input>"); 

    baseSvg.select(".externalObject")
        .on("keyup",function(d){
            thresholdInitial(root)
            thresholdChildren(root,$("#new_x1").val())
            update(root);
            centerNode(root);
            if (chartflag > 0 ){
                baseSvg.selectAll(".chart").remove()
                createChart(root)
            }
        })

    var artefactButton = baseSvg.selectAll("text")
                            .data(allFeatures)
                            .enter().append("text")
                            .attr("class","artefact")
                            .attr("x",0)
                            .attr("y",80)
                            .attr("transform",function(d,i){
                                return "translate(" + 10 + "," + 30*i + ")";
                            })
                            .text(function(d) {return ("√   " + d);})
                            .on("click",function(d){
                                if (allFeatures.indexOf(d) >= 0){
                                    d3.select(this).attr("class","artefactunselected")
                                                    .text(function(d,i){
                                                        return ( "×   " + d)
                                                    })
                                    deleteFeatues.push(d)
                                    allFeatures.remove(d)
                                    deleteArtefactLoop(deleteFeatues)
                                    thresholdInitial(root)
                                    thresholdChildren(root,$("#new_x1").val())
                                    update(root)
                                }
                                else {
                                    d3.select(this).attr("class","artefact") 
                                                    .text(function(d,i){
                                                        return ( "√   " + d)
                                                    })
                                    allFeatures.push(d)
                                    deleteFeatues.remove(d)
                                    deleteArtefactLoop(deleteFeatues)
                                    thresholdInitial(root)
                                    thresholdChildren(root,$("#new_x1").val())   
                                    update(root)                           
                                }
                                if (chartflag > 0 ){
                                        baseSvg.selectAll(".chart").remove()
                                        createChart(root)
                                }
                            });

    var artefactText = baseSvg.append("text")
                            .datum("Choose artefacts:")
                            .attr("x",0)
                            .attr("y",0)
                            .attr("transform",function(d){
                                return "translate(" + 10 + "," + 60 + ")";
                            })
                            .text(function(d) {return d;});

    var thresholdButton = baseSvg.append("text")
                .datum(80)
                .attr("class","buttontext")
                .attr("x",0)
                .attr("y",0)
                .attr("transform",function(d){
                    return "translate(" + 140 + "," + 35 + ")";
                })
                .text(function(d){
                    return ("➢")
                })
                .on("click",function(d){
                    thresholdInitial(root)
                    thresholdChildren(root,$("#new_x1").val())
                    update(root);
                    if (chartflag > 0 ){
                        baseSvg.selectAll(".chart").remove()
                        createChart(root)
                    }
                });

    var viewText = baseSvg.append("text")
                            .datum("Choose views:")
                            .attr("x",0)
                            .attr("y",0)
                            .attr("transform",function(d){
                                return "translate(" + 140 + "," + 60 + ")";
                            })
                            .text(function(d) {return d;});

    var advanceViewButton = baseSvg.append("text")
                .datum("advance")
                .attr("class","artefact")
                .attr("id","advance")
                .attr("x",0)
                .attr("y",0)
                .attr("transform",function(d){
                    return "translate(" + 140 + "," + 80 + ")";
                })
                .text(function(d){
                    return ("√   " + d)
                })
                .on("click",function(d){  
                    baseSvg.selectAll(".chart").remove()
                    chartflag = 0 
                    svgGroup.attr("display","inline")                                
                    d3.select(this).text(function(d){
                        return ( "√   " + d)
                    })
                    .attr("class","artefact")
                    d3.select("#quick").text(function(d){
                        return ("×   " + d)
                    })
                    .attr("class","artefactunselected")
                });
   var quickViewButton = baseSvg.append("text")
                .datum("quick")
                .attr("class","artefactunselected")
                .attr("id","quick")
                .attr("x",0)
                .attr("y",0)
                .attr("transform",function(d){
                    return "translate(" + 140 + "," + 110 + ")";
                })
                .text(function(d){
                    return ("×   " + d)
                })
                .on("click",function(d){                  
                    svgGroup.attr("display","none")
                    createChart(root)
                    chartflag = 1
                    d3.select(this).text(function(d){
                        return ( "√    " + d)
                    })
                    .attr("class","artefact")
                    d3.select("#advance").text(function(d){
                        return ("×   " + d)
                    })
                    .attr("class","artefactunselected")
                });    

    root = treeData;
    root.x0 = viewerHeight / 2;
    root.y0 = 0;

    function clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        if (obj instanceof Array) {
            var copy = [];
            var len = obj.length
            for (var i = 0; i < len; ++i) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }
        if (obj instanceof Object) {
            var copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }
    }

    var tooltip = d3.select("body")
                    .append("div")
                    .attr("class","tooltip")
                    .style("opacity",0.0);

    newroot=clone(root);
    update(root);
    centerNode(root);
});
