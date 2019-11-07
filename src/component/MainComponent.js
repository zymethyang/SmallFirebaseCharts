import React from 'react';
import moment from 'moment';
import './main.scss';
var Chart = require('chart.js');
const mqtt = require('mqtt')

class MainComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chart_01: new Array(25),
            chart_02: new Array(25),
            chart_03: new Array(25),
            labels: new Array(25),
            lastActionTime: 0,
            d_01: 1,
            d_02: 1,
            d_03: 1,
            d_04: 1,
            d_05: 1,
            client: undefined
        }
    }

    componentDidMount() {
        const options = { username: 'sammy', password: '12345678' };
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

                this.setState({ labels });
                this.chart01.update();
            }

            if (jsonMessage.hasOwnProperty('chart_02')) {
                chart_02.push(parseFloat(jsonMessage.chart_02));
                chart_02.shift();
                this.setState({ chart_02 });
                this.chart02.update();
            }

            if (jsonMessage.hasOwnProperty('chart_03')) {
                chart_03.push(parseFloat(jsonMessage.chart_03));
                chart_03.shift();
                this.setState({ chart_03 });
                this.chart03.update();
            }

            /*
            if (jsonMessage.hasOwnProperty('d01')) {
                console.log(jsonMessage);
                if (jsonMessage === 0) {
                    this.setState({ d_01: 2 });
                } else {
                    this.setState({ d_01: 1 });
                }
            }

            if (jsonMessage.hasOwnProperty('d02')) {
                if (jsonMessage.d02 === 0) {
                    this.setState({ d_02: 2 });
                } else {
                    this.setState({ d_02: 1 });
                }
            }

            if (jsonMessage.hasOwnProperty('d03')) {
                if (jsonMessage.d03 === 0) {
                    this.setState({ d_03: 2 });
                } else {
                    this.setState({ d_03: 1 });
                }
            }

            if (jsonMessage.hasOwnProperty('d04')) {
                if (jsonMessage.d04 === 0) {
                    this.setState({ d_04: 2 });
                } else {
                    this.setState({ d_04: 1 });
                }
            }

            if (jsonMessage.hasOwnProperty('d05')) {
                if (jsonMessage.d05 === 0) {
                    this.setState({ d_05: 2 });
                } else {
                    this.setState({ d_05: 1 });
                }
            }
            */
        })
        //Subcribe database, nếu có dữ liệu cảm biến thay đổi thì lấy về.

        const { labels, chart_01, chart_02, chart_03 } = this.state;

        var ctx01 = document.getElementById('canvas01').getContext('2d');
        var ctx02 = document.getElementById('canvas02').getContext('2d');
        var ctx03 = document.getElementById('canvas03').getContext('2d');

        this.chart01 = new Chart(ctx01, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Biểu đồ 01',
                    data: chart_01,
                    pointRadius: 0,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderWidth: .5
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
        });

        this.chart02 = new Chart(ctx02, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Biểu đồ 02',
                    data: chart_02,
                    pointRadius: 0,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderWidth: .5
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
        });

        this.chart03 = new Chart(ctx03, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Biểu đồ 03',
                    data: chart_03,
                    pointRadius: 0,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderWidth: .5
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
        });
    }

    onClickControl(index) {
        var currentTime = moment().unix(new Date());
        var { lastActionTime } = this.state;

        if (currentTime - lastActionTime > 2) {
            var { d_01, d_02, d_03, d_04, d_05 } = this.state;
            switch (index) {
                case 1:
                    d_01 = d_01 === 1 ? 2 : 1;
                    this.state.client.publish('FWpfOR6wyKZIoYj', JSON.stringify({ d_01 }))
                    console.log(JSON.stringify({ d_01 }));
                    break;
                case 2:
                    d_02 = d_02 === 1 ? 2 : 1;
                    this.state.client.publish('FWpfOR6wyKZIoYj', JSON.stringify({ d_02 }))
                    break;
                case 3:
                    d_03 = d_03 === 1 ? 2 : 1;
                    this.state.client.publish('FWpfOR6wyKZIoYj', JSON.stringify({ d_03 }))
                    break;
                case 4:
                    d_04 = d_04 === 1 ? 2 : 1;
                    this.state.client.publish('FWpfOR6wyKZIoYj', JSON.stringify({ d_04 }))
                    break;
                case 5:
                    d_05 = d_05 === 1 ? 2 : 1;
                    this.state.client.publish('FWpfOR6wyKZIoYj', JSON.stringify({ d_05 }))
                    break;
            }
            this.setState({ d_01, d_02, d_03, d_04, d_05 });
            lastActionTime = moment().unix(new Date());
            this.setState({ lastActionTime });
        } else {
            alert("Chờ 2 giây nữa đi ma tốc độ!")
        }
    }

    render() {
        const { d_01, d_02, d_03, d_04, d_05 } = this.state;
        return (
            <div className="container">
                <div className="card">
                    <div className="card--container">
                        <canvas id="canvas01" style={{ width: '100%' }}></canvas>
                    </div>
                </div>
                <div className="card">
                    <div className="card--container">
                        <canvas id="canvas02" style={{ width: '100%' }}></canvas>
                    </div>
                </div>
                <div className="card">
                    <div className="card--container">
                        <canvas id="canvas03" style={{ width: '100%' }}></canvas>
                    </div>
                </div>
                <div className="card">
                    <div className="btn--container">
                        <div style={{ color: d_01 === 2 ? 'purple' : 'black' }} className="btn--style" onClick={() => this.onClickControl(1)}>
                            ĐÈN
                        </div>
                        <div style={{ color: d_02 === 2 ? 'purple' : 'black' }} className="btn--style" onClick={() => this.onClickControl(2)}>
                            BƠM
                        </div>
                        <div style={{ color: d_03 === 2 ? 'purple' : 'black' }} className="btn--style" onClick={() => this.onClickControl(3)}>
                            QUẠT
                        </div>
                        <div style={{ color: d_04 === 2 ? 'purple' : 'black' }} className="btn--style" onClick={() => this.onClickControl(4)}>
                            PHUN SƯƠNG
                        </div>
                        <div style={{ color: d_05 === 2 ? 'purple' : 'black' }} className="btn--style" onClick={() => this.onClickControl(5)}>
                            MÁI CHE
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default MainComponent;