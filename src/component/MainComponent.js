import React from 'react';
import './main.scss';
var Chart = require('chart.js');
const firebase = require('../shared/firebase');
require('firebase/database');


class MainComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chart_01: new Array(25),
            chart_02: new Array(25),
            chart_03: new Array(25),
            labels: new Array(25),
            device_01: false,
            device_02: false,
            device_03: false,
            device_04: false,
            device_05: false
        }
    }

    componentDidMount() {
        //Subcribe database, khi có dữ liệu điều khiển thay đổi thì lấy về
        firebase.database().ref(`/realtime/control/device_01`).on('value', (value) => {
            //Sau đó ghi giá trị thay đổi vào this.state
            this.setState({ device_01: value.val() })
        });
        firebase.database().ref(`/realtime/control/device_02`).on('value', (value) => {
            this.setState({ device_02: value.val() })
        });
        firebase.database().ref(`/realtime/control/device_03`).on('value', (value) => {
            this.setState({ device_03: value.val() })
        });
        firebase.database().ref(`/realtime/control/device_04`).on('value', (value) => {
            this.setState({ device_04: value.val() })
        });
        firebase.database().ref(`/realtime/control/device_05`).on('value', (value) => {
            this.setState({ device_05: value.val() })
        });

        //Subcribe database, nếu có dữ liệu cảm biến thay đổi thì lấy về.

        firebase.database().ref('/realtime/charts').on('value', (data) => {
            var { chart_01, chart_02, chart_03, labels } = this.state;

            //Ép kiểu về float sau đó đẩy vào hàng đợi.
            chart_01.push(parseFloat(data.val().chart_01));

            //Sau đó shift 1 phần từ đầu của hàng đợi ra.
            chart_01.shift();

            chart_02.push(parseFloat(data.val().chart_02));
            chart_02.shift();
            chart_03.push(parseFloat(data.val().chart_03));
            chart_03.shift();
            labels.push('');
            labels.shift();

            this.setState({
                chart_01,
                chart_02,
                chart_03,
                labels
            });

            //cập nhật lại biểu đồ
            this.chart01.update();
            this.chart02.update();
            this.chart03.update();
        });

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
        firebase.database().ref(`/realtime/control/device_0${index}`).once('value', (value) => {
            firebase.database().ref(`/realtime/control/device_0${index}`).set(!value.val());
        });
    }

    render() {
        const { device_01, device_02, device_03, device_04, device_05 } = this.state;
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
                        <div style={{ color: device_01 ? 'purple' : 'black' }} className="btn--style" onClick={() => this.onClickControl(1)}>
                            ĐÈN
                        </div>
                        <div style={{ color: device_02 ? 'purple' : 'black' }} className="btn--style" onClick={() => this.onClickControl(2)}>
                            BƠM
                        </div>
                        <div style={{ color: device_03 ? 'purple' : 'black' }} className="btn--style" onClick={() => this.onClickControl(3)}>
                            QUẠT
                        </div>
                        <div style={{ color: device_04 ? 'purple' : 'black' }} className="btn--style" onClick={() => this.onClickControl(4)}>
                            PHUN SƯƠNG
                        </div>
                        <div style={{ color: device_05 ? 'purple' : 'black' }} className="btn--style" onClick={() => this.onClickControl(5)}>
                            MÁI CHE
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default MainComponent;