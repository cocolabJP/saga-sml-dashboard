let $=e=>document.getElementById(e),TARGET_SENSOR_IDS=[{installed:!0,name:"656広場"},{installed:!0,name:"FabLab Saga"},{installed:!0,name:"たなかさんち"},{installed:!0,name:"エスプラッツ（南）"},{installed:!0,name:"エスプラッツ（南東）"},{installed:!0,name:"エスプラッツ（西）"},{installed:!0,name:"エスプラッツ（北）"},{installed:!0,name:"トネリコ・カフェ"},{installed:!0,name:"白山名店街（自動販売機横）"},{installed:!0,name:"スマート街なかテラス"},{installed:!0,name:"鮨・椿油天ぷら八木"},{installed:!0,name:"緑道広場（サイネージ）"},{installed:!0,name:"SUNRISE POCKET（サイネージ）"},{installed:!0,name:"白山テラス（サイネージ）"},{installed:!0,name:"E.A.D"},{installed:!0,name:"村岡屋 本店"},{installed:!1,name:"駅前中央通り②（とも蔵・わん前）"},{installed:!0,name:"駅前交流広場"},{installed:!0,name:"えきまち一丁目"},{installed:!0,name:"サガハツ"},{installed:!0,name:"佐賀駅バスセンター（西側）"},{installed:!0,name:"佐賀駅バスセンター（構内）"},{installed:!1,name:"駅前中央通り①（ニッポンレンタカー前）"},{installed:!0,name:"かど屋佐賀駅北口店"},{installed:!1,name:"ROUGH cafe&dining bar(旧)"},{installed:!0,name:"まちかど広場（サイネージ）"},{installed:!0,name:"もしもしかめさん"},{installed:!0,name:"ANZee."},{installed:!1,name:"SAGAアリーナ"},{installed:!1,name:"駅前中央通り③（三井住友銀行前）"},{installed:!1,name:""},{installed:!0,name:"ROUGH cafe&dining bar"},{installed:!1,name:""},{installed:!1,name:""},{installed:!1,name:""}],Util={getCurrentTime:()=>(new Date).getTime(),getDatetimeStr:e=>{e=new Date(e);return e.getFullYear()+"/"+("0"+(e.getMonth()+1)).slice(-2)+"/"+("0"+e.getDate()).slice(-2)+" "+("0"+e.getHours()).slice(-2)+":"+("0"+e.getMinutes()).slice(-2)+":"+("0"+e.getSeconds()).slice(-2)},getTimeago:e=>{e=new Date(Util.getCurrentTime()-e);return e.getUTCMonth()?e.getUTCMonth()-1+"ヶ月前":e.getUTCDate()-1?e.getUTCDate()-1+"日前":e.getUTCHours()?e.getUTCHours()+"時間前":e.getUTCMinutes()?e.getUTCMinutes()+"分前":e.getUTCSeconds()+"秒前"}};var app=new Vue({el:"#main",data:{mode:"dashboard",isLoading:!1,isLoaded:!1,option:{start_at:null,end_at:null,area:5e3,type:1,page:null},sensorStatus:{},targetSensorIDs:TARGET_SENSOR_IDS},methods:{getData:function(){this.setCurrentTime(),this.isLoading=!0,this.isLoaded=!1,$("json-view").innerHTML="",axios.get("https://datalake.iopt.jp/v1/sensor_data",{params:this.option}).then(e=>{this.isLoading=!1,this.isLoaded=!0;let n=e.data.body,i="",s=[];n.forEach((e,t)=>{var a=1e3*e.meta.data_time,a=(n[t].meta.date_str=Util.getDatetimeStr(a)+" ("+Util.getTimeago(a)+")",i+="<tr><td>"+t+"</td><td>"+e.meta.sensor_id+"</td><td>"+n[t].meta.date_str+"</td><td>"+e.body.records+"</td><td>"+e.body.filesize+"</td></tr>",s.push(e.meta.sensor_id),parseInt(e.meta.sensor_id.slice(-3)));a in this.sensorStatus||(this.sensorStatus[a]={t:n[t].meta.date_str,records:e.body.records,filesize:e.body.filesize})}),$("json-view").innerHTML="";e=JsonView.createTree(JSON.stringify(n)),JsonView.render(e,document.querySelector("#json-view")),JsonView.expandChildren(e),$("summary-table").innerHTML=i,e=Array.from(new Set(s)).sort();$("sensor-ids").innerHTML=e.join(", ")+"<br>["+e.length+" devices found]"}).catch(e=>{console.log(e)}).then(()=>{})},setCurrentTime:function(e){this.option.start_at=parseInt(Util.getCurrentTime()/1e3-3600),this.option.end_at=parseInt(Util.getCurrentTime()/1e3)},changeMode(e){this.mode=e},getSensorID(e){return"RPI_"+("00"+(e+1)).slice(-3)},checkAvailability(e){}},computed:{isDashboardMode:function(){return"dashboard"==this.mode},isSummaryMode:function(){return"summary"==this.mode},isDetailedMode:function(){return"detailed"==this.mode},targetPeriod:function(){return Util.getDatetimeStr(1e3*this.option.start_at)+" 〜 "+Util.getDatetimeStr(1e3*this.option.end_at)}}});app.getData();