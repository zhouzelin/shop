/*eatWhat.js*/
let app = getApp();

Page({
    data: {
        defaultList: ["盖浇饭", "砂锅", "大排档", "米线", "满汉全席", "西餐", "麻辣烫", "自助餐", "炒面", "快餐", "水果", "西北风", "馄饨", "火锅", "烧烤", "泡面", "速冻水饺", "日本料理", "涮羊肉", "味千拉面", "肯德基", "面包", "扬州炒饭", "自助餐", "茶餐厅", "海底捞", "咖啡", "比萨", "麦当劳", "兰州拉面", "沙县小吃", "烤鱼", "海鲜", "铁板烧", "韩国料理", "粥", "快餐", "东南亚菜", "甜点", "农家菜", "川菜", "粤菜", "湘菜", "本帮菜", "竹笋烤肉"],
        userinfo: {},
        food: '',
        timer: null,
        isStart: false,
        showList: '',
        isOpen: false
    },
    onLoad() {
        let len = this.data.defaultList.length;
        let index = parseInt(Math.random()*len);
        let food = this.data.defaultList[index];
        this.setData({
            userInfo: app.globalData.userInfo,
            food: food
        })
    },
    switchFood() {
        let isStart = this.data.isStart;
        if(isStart) {
            clearInterval(this.data.timer);

            this.setData({
                isStart: false,
                timer: null
            });
        }else {
            let timer = setInterval(function(){
                let len = this.data.defaultList.length;
                let index = parseInt(Math.random()*len);
                let food = this.data.defaultList[index];

                this.setData({
                    food: food
                })
            }.bind(this),100);

            this.setData({
                isStart: true,
                timer: timer
            });
        }
    },
    openMask() {
        let isOpen = true;
        let showList = this.data.defaultList.join(" ");
        this.setData({
            isOpen: isOpen,
            showList: showList
        })
    },
    handleInput(event) {
        let showList = event.detail.value;
        this.setData({
            showList: showList
        })
    },
    confirm() {
        let isOpen = false;
        this.setData({
            defaultList: this.data.showList.split(" "),
            isOpen: isOpen
        })
    }
})