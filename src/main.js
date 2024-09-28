const $ = (id) => {
  return document.getElementById(id);
};

const TARGET_SENSOR_IDS = [
  {installed: true,  name: "656広場"}, // 1
  {installed: true,  name: "FabLab Saga"}, // 2
  {installed: true,  name: "たなかさんち"}, // 3
  {installed: true,  name: "エスプラッツ（南）"}, // 4
  {installed: true,  name: "エスプラッツ（南東）"}, // 5
  {installed: true,  name: "エスプラッツ（西）"}, // 6
  {installed: true,  name: "エスプラッツ（北）"}, // 7
  {installed: true,  name: "トネリコ・カフェ"}, // 8
  {installed: true,  name: "白山名店街（自動販売機横）"}, // 9
  {installed: true,  name: "スマート街なかテラス"}, // 10,
  {installed: true,  name: "鮨・椿油天ぷら八木"}, // 11
  {installed: true,  name: "緑道広場（サイネージ）"}, // 12
  {installed: true,  name: "SUNRISE POCKET（サイネージ）"}, // 13
  {installed: true,  name: "白山テラス（サイネージ）"}, // 14
  {installed: true,  name: "E.A.D"}, // 15
  {installed: true,  name: "村岡屋 本店"}, // 16
  {installed: false,  name: "駅前中央通り②（とも蔵・わん前）"}, // 17
  {installed: true,  name: "駅前交流広場"}, // 18
  {installed: true,  name: "えきまち一丁目"}, // 19
  {installed: true,  name: "サガハツ"}, // 20,
  {installed: true,  name: "佐賀駅バスセンター（西側）"}, // 21
  {installed: true,  name: "佐賀駅バスセンター（構内）"}, // 22
  {installed: false,  name: "駅前中央通り①（ニッポンレンタカー前）"}, // 23
  {installed: true,  name: "かど屋佐賀駅北口店"}, // 24
  {installed: true,  name: "ROUGH cafe&dining bar"}, // 25
  {installed: true,  name: "まちかど広場（サイネージ）"}, // 26
  {installed: true,  name: "もしもしかめさん"}, // 27
  {installed: true,  name: "ANZee."}, // 28
  {installed: false,  name: "SAGAアリーナ"}, // 29
  {installed: false,  name: "駅前中央通り③（三井住友銀行前）"}, // 30
  {installed: false, name: ""}, // 31
  {installed: false, name: ""}, // 32
  {installed: false, name: ""}, // 33
  {installed: false, name: ""}, // 34
  {installed: false, name: ""}, // 35
]

const Util = {
  getCurrentTime: () => {
    return new Date().getTime();
  },
  getDatetimeStr: (timestamp) => {
    var d = new Date(timestamp);
    return d.getFullYear()
            + '/' + ('0' + (d.getMonth() + 1)).slice(-2)
            + '/' + ('0' + d.getDate()).slice(-2)
            + ' ' + ('0' + d.getHours()).slice(-2)
            + ':' + ('0' + d.getMinutes()).slice(-2)
            + ':' + ('0' + d.getSeconds()).slice(-2);
  },
  getTimeago: (timestamp) => {
    var d = new Date(Util.getCurrentTime() - timestamp);
    if(d.getUTCMonth())         { return d.getUTCMonth() - 1 + 'ヶ月前'  }
    else if(d.getUTCDate() - 1) { return d.getUTCDate()  - 1 + '日前'  }
    else if(d.getUTCHours())    { return d.getUTCHours()     + '時間前' }
    else if(d.getUTCMinutes())  { return d.getUTCMinutes()   + '分前'  }
    else                        { return d.getUTCSeconds()   + '秒前'  }
  },
};

var app = new Vue({
  el: '#main',
  data: {
    mode: 'dashboard',
    isLoading: false,
    isLoaded : false,
    option: {
      start_at: null,
      end_at: null,
      area: 5000,
      type: 1,
      page: null
    },
    sensorStatus: {},
    targetSensorIDs: TARGET_SENSOR_IDS,
  },
  methods: {
    getData: function() {
      this.setCurrentTime();

      this.isLoading = true;
      this.isLoaded = false;
      $("json-view").innerHTML = "";
      axios.get('https://datalake.iopt.jp/v1/sensor_data', {
        params: this.option
      })
      .then((response) => {
        this.isLoading = false;
        this.isLoaded = true;
        let jsonArray = response.data.body;
        let summaryTable = "";
        let sensorIDs = [];
        jsonArray.forEach((e, i) => {
          let t = e.meta.data_time * 1000;
          jsonArray[i].meta.date_str = Util.getDatetimeStr(t) + " (" + Util.getTimeago(t) + ")";
          summaryTable += '<tr><td>' + i + '</td><td>' + e.meta.sensor_id + '</td><td>' + jsonArray[i].meta.date_str + '</td><td>' + e.body.records + '</td><td>' + e.body.filesize + '</td></tr>'
          sensorIDs.push(e.meta.sensor_id);
          let sensorID = parseInt(e.meta.sensor_id.slice(-3));
          if(!(sensorID in this.sensorStatus)) {
            this.sensorStatus[sensorID] = {"t": jsonArray[i].meta.date_str, "records": e.body.records, "filesize": e.body.filesize};
          }
        });
        $("json-view").innerHTML = "";
        const treeDetailed = JsonView.createTree(JSON.stringify(jsonArray));
        JsonView.render(treeDetailed, document.querySelector('#json-view'));
        JsonView.expandChildren(treeDetailed);
        $("summary-table").innerHTML = summaryTable;
        let uniqueSensorIDs = Array.from(new Set(sensorIDs)).sort();
        $("sensor-ids").innerHTML = uniqueSensorIDs.join(', ') + "<br>[" + uniqueSensorIDs.length + " devices found]";
      })
      .catch((error) => {
        console.log(error);
      })
      .then(() => {
      });  
    },
    setCurrentTime: function(offset) {
      this.option.start_at = parseInt(Util.getCurrentTime()/1000 - 60 * 60); // 60 min
      this.option.end_at   = parseInt(Util.getCurrentTime()/1000      );
    },
    changeMode(mode) {
      this.mode = mode;
    },
    getSensorID(sensorID) {
      return "RPI_" + ("00" + (sensorID+1)).slice(-3);
    },
    checkAvailability(sensorID) {

    },
  },
  computed: {
    isDashboardMode: function() { return this.mode == 'dashboard'; },
    isSummaryMode: function() { return this.mode == 'summary'; },
    isDetailedMode: function() { return this.mode == 'detailed'; },
    targetPeriod: function() { return Util.getDatetimeStr(this.option.start_at*1000) + " 〜 " + Util.getDatetimeStr(this.option.end_at*1000); },
  }
});

app.getData();