{
  name: '{{objectId()}}',
  all_features: ["domain","pehash","imphash","ip"],
  children:[
    {
      'repeat(3,3)':{
        name: '{{objectId()}}',
        final_score: '{{floating(80, 90, 2,"0.00")}}',
        indicator_socre: function (tags,parent){
          var showstring = "";
          showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />" + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />" + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />" + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
          return showstring;
        }
      }
    },
    {
      name: ["domain","pehash","imphash"],
      final_score: '{{floating(80, 100, 2,"0.00")}}',
      children:[
        {
          'repeat(2,2)':{
            name: '{{objectId()}}',
            final_score: function (tags,parent){
              return (tags.floating(50, parent.final_score, 2,"0.00"));
            },
            indicator_socre: function (tags,parent){
              var showstring = "";
              if (parent.name.indexOf("domain") >= 0)
                showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
              if (parent.name.indexOf("ip") >= 0)
                showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
              if (parent.name.indexOf("pehash") >= 0)
                showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
              if (parent.name.indexOf("imphash") >= 0)
                showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
              return showstring;
            }            
          }
        },
        {
          name: '{{objectId()}}',
          final_score: function (tags,parent){
            return parent.final_score; 
          },
          indicator_socre: function (tags,parent){
            var showstring = "";
            if (parent.name.indexOf("domain") >= 0)
              showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
            if (parent.name.indexOf("ip") >= 0)
              showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
            if (parent.name.indexOf("pehash") >= 0)
              showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
            if (parent.name.indexOf("imphash") >= 0)
              showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
            return showstring;
          }  
        },
        {
          name: ["domain","pehash"],
          final_score: function (tags,parent){
            return (tags.floating(60, parent.final_score, 2,"0.00"));    
          },
          children:[
            {
              name: '{{objectId()}}',
              final_score: function (tags,parent){
                return (tags.floating(50, parent.final_score, 2,"0.00")); 
              },
              indicator_socre: function (tags,parent){
                var showstring = "";
                if (parent.name.indexOf("domain") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
                if (parent.name.indexOf("ip") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
                if (parent.name.indexOf("pehash") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
                if (parent.name.indexOf("imphash") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
                return showstring;
              }                
            },
            {
              name: ["domain"],
              final_score: function (tags,parent){
                return parent.final_score; 
              },
              children:[
                {
                  'repeat(2,2)':{
                    name: '{{objectId()}}',
                    final_score: function (tags,parent){
                      return (tags.floating(30, parent.final_score, 2,"0.00")); 
            		},
                    indicator_socre: function (tags,parent){
                      var showstring = "";
                      if (parent.name.indexOf("domain") >= 0)
                        showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
                      if (parent.name.indexOf("ip") >= 0)
                        showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
                      if (parent.name.indexOf("pehash") >= 0)
                        showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
                      if (parent.name.indexOf("imphash") >= 0)
                        showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
                      return showstring;
                    }                      
                  }
                },
                {
                  name: '{{objectId()}}',
                  final_score: function (tags,parent){
                    return parent.final_score;          
                  },
                  indicator_socre: function (tags,parent){
                    var showstring = "";
                    if (parent.name.indexOf("domain") >= 0)
                      showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
                    if (parent.name.indexOf("ip") >= 0)
                      showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
                    if (parent.name.indexOf("pehash") >= 0)
                      showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
                    if (parent.name.indexOf("imphash") >= 0)
                      showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
                    return showstring;
                  }                    
                }
              ]
            },
            {
              name: ["pehash"],
              final_score: function (tags,parent){
                return (tags.floating(40, parent.final_score, 2,"0.00"));    
              },
              children:[
                {
                  name: '{{objectId()}}',
                  final_score: function (tags,parent){
                    return parent.final_score;          
                  },
                  indicator_socre: function (tags,parent){
                    var showstring = "";
                    if (parent.name.indexOf("domain") >= 0)
                      showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
                    if (parent.name.indexOf("ip") >= 0)
                      showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
                    if (parent.name.indexOf("pehash") >= 0)
                      showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
                    if (parent.name.indexOf("imphash") >= 0)
                      showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
                    return showstring;
                  }                    
                }
              ]
            }
          ]
        },
        {
          name: ["domain","imphash"],
          final_score: function (tags,parent){
            return (tags.floating(60, parent.final_score, 2,"0.00"));    
          },
          children:[
            {
              name: '{{objectId()}}',
              final_score: function (tags,parent){
                return parent.final_score; 
              },
              indicator_socre: function (tags,parent){
                var showstring = "";
                if (parent.name.indexOf("domain") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
                if (parent.name.indexOf("ip") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
                if (parent.name.indexOf("pehash") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
                if (parent.name.indexOf("imphash") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
                return showstring;
              }                
            },
            {
              name: '{{objectId()}}',
              final_score: function (tags,parent){
                return (tags.floating(40, parent.final_score, 2,"0.00"));
              },
              indicator_socre: function (tags,parent){
                var showstring = "";
                if (parent.name.indexOf("domain") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
                if (parent.name.indexOf("ip") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
                if (parent.name.indexOf("pehash") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
                if (parent.name.indexOf("imphash") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
                return showstring;
              }                
            },
            {
              name: ["imphash"],
              final_score: function (tags,parent){
                return (tags.floating(40, parent.final_score, 2,"0.00"));    
              },
              children:[
                {
                  name: '{{objectId()}}',
                  final_score: function (tags,parent){
                    return parent.final_score; 
            	  },
                  indicator_socre: function (tags,parent){
                    var showstring = "";
                    if (parent.name.indexOf("domain") >= 0)
                      showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
                    if (parent.name.indexOf("ip") >= 0)
                      showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
                    if (parent.name.indexOf("pehash") >= 0)
                      showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
                    if (parent.name.indexOf("imphash") >= 0)
                      showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
                    return showstring;
                  }                  
                },
                {
                  'repeat(2,2)':{
                    name: '{{objectId()}}',
                    final_score: function (tags,parent){
                      return (tags.floating(30, parent.final_score, 2,"0.00"));
            		},
                    indicator_socre: function (tags,parent){
                      var showstring = "";
                      if (parent.name.indexOf("domain") >= 0)
                        showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
                      if (parent.name.indexOf("ip") >= 0)
                        showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
                      if (parent.name.indexOf("pehash") >= 0)
                        showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
                      if (parent.name.indexOf("imphash") >= 0)
                        showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
                      return showstring;
                    }                    
                  }
                }
              ]
            }
          ]
        },
        {
          name: ["pehash","imphash"],
          final_score: function (tags,parent){
            return (tags.floating(50, parent.final_score, 2,"0.00"));    
          },
          children:[
            {           
              name: '{{objectId()}}',
              final_score: function (tags,parent){
                return parent.final_score; 
              },
              indicator_socre: function (tags,parent){
                var showstring = "";
                if (parent.name.indexOf("domain") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
                if (parent.name.indexOf("ip") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
                if (parent.name.indexOf("pehash") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
                if (parent.name.indexOf("imphash") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
                return showstring;
              }              
            },
            {
              'repeat(3,3)':{              
                name: '{{objectId()}}',
                final_score: function (tags,parent){
                  return (tags.floating(50, parent.final_score, 2,"0.00"));    
                },
                indicator_socre: function (tags,parent){
                  var showstring = "";
                  if (parent.name.indexOf("domain") >= 0)
                    showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
                  if (parent.name.indexOf("ip") >= 0)
                    showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
                  if (parent.name.indexOf("pehash") >= 0)
                    showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
                  if (parent.name.indexOf("imphash") >= 0)
                    showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
                  return showstring;
                }                
              }
            }            
          ]
        }
      ]
    },
    {
      name: ["domain","pehash","ip"],
      final_score: '{{floating(70, 100, 2,"0.00")}}',
      children:[
        {
          'repeat(2,2)':{
            name: '{{objectId()}}',
            final_score: function (tags,parent){
              return (tags.floating(50, parent.final_score, 2,"0.00"));  
            },
            indicator_socre: function (tags,parent){
              var showstring = "";
              if (parent.name.indexOf("domain") >= 0)
                showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
              if (parent.name.indexOf("ip") >= 0)
                showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
              if (parent.name.indexOf("pehash") >= 0)
                showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
              if (parent.name.indexOf("imphash") >= 0)
                showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
              return showstring;
            }            
          }
        },
        {
          name: ["domain","ip"],
          final_score: function (tags,parent){
            return parent.final_score;     
          },
          children:[
            {
              name: '{{objectId()}}',
              final_score: function (tags,parent){
                return parent.final_score; 
              },
              indicator_socre: function (tags,parent){
                var showstring = "";
                if (parent.name.indexOf("domain") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
                if (parent.name.indexOf("ip") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
                if (parent.name.indexOf("pehash") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
                if (parent.name.indexOf("imphash") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
                return showstring;
              }              
            },
            {
              'repeat(2,2)':{             
                name: '{{objectId()}}',
                final_score: function (tags,parent){
                  return (tags.floating(40, parent.final_score, 2,"0.00"));  
                },
                indicator_socre: function (tags,parent){
                  var showstring = "";
                  if (parent.name.indexOf("domain") >= 0)
                    showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
                  if (parent.name.indexOf("ip") >= 0)
                    showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
                  if (parent.name.indexOf("pehash") >= 0)
                    showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
                  if (parent.name.indexOf("imphash") >= 0)
                    showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
                  return showstring;
                }                
              }
            },
            {
              name: ["ip"],
              final_score: function (tags,parent){
                return (tags.floating(40, parent.final_score, 2,"0.00"));    
              },
              children:[
                {
                  name: '{{objectId()}}',
                  final_score: function (tags,parent){
                    return parent.final_score; 
                  },
                  indicator_socre: function (tags,parent){
                    var showstring = "";
                    if (parent.name.indexOf("domain") >= 0)
                      showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
                    if (parent.name.indexOf("ip") >= 0)
                      showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
                    if (parent.name.indexOf("pehash") >= 0)
                      showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
                    if (parent.name.indexOf("imphash") >= 0)
                      showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
                    return showstring;
                  }                  
                }
              ]
            }
          ]
        },
        {
          name: ["pehash","ip"],
          final_score: function (tags,parent){
            return (tags.floating(60, parent.final_score, 2,"0.00"));    
          },
          children:[
            {
              name: '{{objectId()}}',
              final_score: function (tags,parent){
                return parent.final_score; 
              },
              indicator_socre: function (tags,parent){
                var showstring = "";
                if (parent.name.indexOf("domain") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
                if (parent.name.indexOf("ip") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
                if (parent.name.indexOf("pehash") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
                if (parent.name.indexOf("imphash") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
                return showstring;
              }              
            }
          ]
        }
      ]
    },
    {
      name: ["domain","imphash","ip"],
      final_score: '{{floating(70, 80, 2,"0.00")}}',
      children:[
        {
          'repeat(2,2)':{
            name: '{{objectId()}}',
            final_score: function (tags,parent){
              return (tags.floating(60, parent.final_score, 2,"0.00"));  
            },
            indicator_socre: function (tags,parent){
              var showstring = "";
              if (parent.name.indexOf("domain") >= 0)
                showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
              if (parent.name.indexOf("ip") >= 0)
                showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
              if (parent.name.indexOf("pehash") >= 0)
                showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
              if (parent.name.indexOf("imphash") >= 0)
                showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
              return showstring;
            }            
          }
        },
        {
          name: '{{objectId()}}',
          final_score: function (tags,parent){
            return parent.final_score; 
          },
          indicator_socre: function (tags,parent){
            var showstring = "";
            if (parent.name.indexOf("domain") >= 0)
              showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
            if (parent.name.indexOf("ip") >= 0)
              showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
            if (parent.name.indexOf("pehash") >= 0)
              showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
            if (parent.name.indexOf("imphash") >= 0)
              showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
            return showstring;
          }          
        },
        {
          name: ["imphash","ip"],
          final_score: function (tags,parent){
            return (tags.floating(60, parent.final_score, 2,"0.00"));    
          },
          children:[
            {
              name: '{{objectId()}}',
              final_score: function (tags,parent){
                return parent.final_score; 
              },
              indicator_socre: function (tags,parent){
                var showstring = "";
                if (parent.name.indexOf("domain") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
                if (parent.name.indexOf("ip") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
                if (parent.name.indexOf("pehash") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
                if (parent.name.indexOf("imphash") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
                return showstring;
              }               
            },
            {
              name: '{{objectId()}}',
              final_score: function (tags,parent){
                return (tags.floating(60, parent.final_score, 2,"0.00"));    
              },
              indicator_socre: function (tags,parent){
                var showstring = "";
                if (parent.name.indexOf("domain") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
                if (parent.name.indexOf("ip") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
                if (parent.name.indexOf("pehash") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
                if (parent.name.indexOf("imphash") >= 0)
                  showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
                return showstring;
              }              
            }            
          ]
        }
      ]
    },
    {
      name: ["domain","imphash","ip"],
      final_score: '{{floating(70, 80, 2,"0.00")}}',
      children:[
        {
          'repeat(2,2)':{
            name: '{{objectId()}}',
            final_score: function (tags,parent){
			  return (tags.floating(60, parent.final_score, 2,"0.00")); 
            },
            indicator_socre: function (tags,parent){
              var showstring = "";
              if (parent.name.indexOf("domain") >= 0)
                showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
              if (parent.name.indexOf("ip") >= 0)
                showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
              if (parent.name.indexOf("pehash") >= 0)
                showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
              if (parent.name.indexOf("imphash") >= 0)
                showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
              return showstring;
            }            
          }
        },
        {
          name: '{{objectId()}}',
          final_score: function (tags,parent){
            return parent.final_score; 
          },
          indicator_socre: function (tags,parent){
            var showstring = "";
            if (parent.name.indexOf("domain") >= 0)
              showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" + Math.round(this.final_score / tags.integer(1, 5) / 10) + "&nbspdomains<br />";
            if (parent.name.indexOf("ip") >= 0)
              showstring = showstring + "&nbsp&nbsp&nbspCommunicated with:&nbsp" +  Math.round(this.final_score / tags.integer(1, 5) / 10)+ "&nbspips<br />";
            if (parent.name.indexOf("pehash") >= 0)
              showstring = showstring + "&nbsp&nbsp&nbspPehash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(6,10) * 8) + "&nbsp<br />";
            if (parent.name.indexOf("imphash") >= 0)
              showstring = showstring + "&nbsp&nbsp&nbspImphash similarity is:&nbsp" + Math.round(this.final_score / tags.integer(60,100) * 80);
            return showstring;
          }          
        }
      ]
    }
  ]
}
