import React from 'react';
import moment from 'moment';
import './main.scss';
var Chart = require('chart.js');
const mqtt = require('mqtt')

class MainComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chart_01: new Array(50),
            chart_02: new Array(50),
            chart_03: new Array(50),
            labels: new Array(50),
            lastActionTime: 0,
            d_01: 2,
            d_02: 2,
            d_03: 2,
            d_04: 2,
            d_05: 2,
            client: undefined,

            temp: 0,
            hum: 0,
            hum_g: 0
        }
    }

    componentDidMount() {
        const options = { username: 'sammy', password: '12345678', clientId: `client-${Math.random()}` };
        const client = mqtt.connect('ws://13.229.222.102:8883', options)
        this.setState({ client });
        client.on('connect', function () {
            client.subscribe('Qx3rlKNqKPJAISs', function (err) {
                if (!err) {
                    console.log("Connected");
                }
            })
        })

        client.on('message', (topic, message) => {
            const jsonMessage = JSON.parse(message.toString());

            if (jsonMessage.hasOwnProperty('chart_01')) {
                //Ép kiểu về float sau đó đẩy vào hàng đợi.
                chart_01.push(parseFloat(jsonMessage.chart_01));
                //Sau đó shift 1 phần từ đầu của hàng đợi ra.
                chart_01.shift();
                //cập nhật lại biểu đồ
                this.setState({ chart_01 });
                labels.push('');
                labels.shift();

                chart_02.push(parseFloat(jsonMessage.chart_02));
                chart_02.shift();
                this.setState({ chart_02 });

                chart_03.push(parseFloat(jsonMessage.chart_03));
                chart_03.shift();
                this.setState({ chart_03 });

                this.setState({ labels });

                this.chart01.update();

                this.setState({ temp: parseFloat(jsonMessage.chart_01), hum: parseFloat(jsonMessage.chart_02), hum_g: parseFloat(jsonMessage.chart_03) })

            }

            if (jsonMessage.hasOwnProperty('d01')) {
                this.setState({ d_01: jsonMessage.d01 });
            }

            if (jsonMessage.hasOwnProperty('d02')) {
                this.setState({ d_02: jsonMessage.d02 });
            }

            if (jsonMessage.hasOwnProperty('d03')) {
                this.setState({ d_03: jsonMessage.d03 });
            }

            if (jsonMessage.hasOwnProperty('d04')) {
                this.setState({ d_04: jsonMessage.d04 });
            }

            if (jsonMessage.hasOwnProperty('d05')) {
                this.setState({ d_05: jsonMessage.d05 });
            }

        })
        //Subcribe database, nếu có dữ liệu cảm biến thay đổi thì lấy về.

        const { labels, chart_01, chart_02, chart_03 } = this.state;

        var config = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Nhiệt độ',
                    backgroundColor: 'red',
                    borderColor: 'red',
                    data: chart_01,
                    fill: false,
                }, {
                    label: 'Độ ẩm không khí',
                    fill: false,
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    data: chart_02,
                }, {
                    label: 'Độ ẩm đất',
                    fill: false,
                    backgroundColor: 'green',
                    borderColor: 'green',
                    data: chart_03,
                }]
            },
            options: {
                scales: {
                    xAxes: [
                        {
                            ticks: {
                                display: false
                            }
                        }
                    ]
                }
            }
        };

        var ctx01 = document.getElementById('canvas01').getContext('2d');
        this.chart01 = new Chart(ctx01, config);
    }

    onClickControl(index) {
        var currentTime = moment().unix(new Date());
        var { lastActionTime } = this.state;

        if (currentTime - lastActionTime > 2) {
            var { d_01, d_02, d_03, d_04, d_05 } = this.state;
            switch (index) {
                case 1:
                    if (d_01 === 1)
                        d_01 = 2
                    else
                        d_01 = 1
                    this.state.client.publish('FWpfOR6wyKZIoYj', JSON.stringify({ d_01: d_01 }))
                    break;
                case 2:
                    if (d_02 === 1)
                        d_02 = 2
                    else
                        d_02 = 1
                    this.state.client.publish('FWpfOR6wyKZIoYj', JSON.stringify({ d_02 }))
                    break;
                case 3:
                    if (d_03 === 1)
                        d_03 = 2
                    else
                        d_03 = 1
                    this.state.client.publish('FWpfOR6wyKZIoYj', JSON.stringify({ d_03 }))
                    break;
                case 4:
                    if (d_04 === 1)
                        d_04 = 2
                    else
                        d_04 = 1
                    this.state.client.publish('FWpfOR6wyKZIoYj', JSON.stringify({ d_04 }))
                    break;
                case 5:
                    if (d_05 === 1)
                        d_05 = 2
                    else
                        d_05 = 1
                    this.state.client.publish('FWpfOR6wyKZIoYj', JSON.stringify({ d_05 }))
                    break;
            }
            lastActionTime = moment().unix(new Date());
            this.setState({ lastActionTime });
            alert("Đã gửi lệnh!")
        } else {
            alert("Chờ 2 giây nữa đi ma tốc độ!")
        }
    }

    render() {
        const { d_01, d_02, d_03, d_04, d_05, temp, hum, hum_g } = this.state;
        console.log(d_01, d_02, d_03, d_04, d_05)
        return (
            <div className="container">
                <div className="card--charts">
                    <canvas id="canvas01"></canvas>
                </div>
                <div className="card--info">
                    <div className="card--info--realtime">
                        <div className="card--info--realtime--container">
                            <div className="card--info--realtime--title">Nhiệt độ</div>
                            <div>{temp}°C</div>
                        </div>

                        <div className="card--info--realtime--container">
                            <div className="card--info--realtime--title">Độ ẩm không khí</div>
                            <div>{hum}%</div>
                        </div>

                        <div className="card--info--realtime--container">
                            <div className="card--info--realtime--title">Độ ẩm đất</div>
                            <div>{hum_g}%</div>
                        </div>
                    </div>

                    <div className="btn--container">
                        <div className="btn--style" onClick={() => this.onClickControl(1)}>
                            <img src={d_01 === 2 ? "./on-black.png" : "./on.png"} style={{ width: '100%', height: '100%' }} />
                            <div className="btn--title">Đèn</div>
                        </div>
                        <div className="btn--style" onClick={() => this.onClickControl(2)}>
                            <img src={d_02 === 2 ? "./on-black.png" : "./on.png"} style={{ width: '100%', height: '100%' }} />
                            <div className="btn--title">Bơm</div>
                        </div>
                        <div className="btn--style" onClick={() => this.onClickControl(3)}>
                            <img src={d_03 === 2 ? "./on-black.png" : "./on.png"} style={{ width: '100%', height: '100%' }} />
                            <div className="btn--title">Quạt</div>
                        </div>
                        <div className="btn--style" onClick={() => this.onClickControl(4)}>
                            <img src={d_04 === 2 ? "./on-black.png" : "./on.png"} style={{ width: '100%', height: '100%' }} />
                            <div className="btn--title">Phun sương</div>
                        </div>
                        <div className="btn--style" onClick={() => this.onClickControl(5)}>
                            <img src={d_05 === 2 ? "./on-black.png" : "./on.png"} style={{ width: '100%', height: '100%' }} />
                            <div className="btn--title">Mái che</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default MainComponent;