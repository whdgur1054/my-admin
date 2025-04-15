// src/pages/Dashboard.tsx
import {
  AlertOutlined,
  CalendarOutlined,
  EditOutlined,
  FormOutlined,
  MessageOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { Avatar, Badge, Card, Col, Flex, Row, Statistic } from "antd"
import React from "react"
import ReactApexChart from "react-apexcharts"

const Dashboard: React.FC = () => {
  const [state, setState] = React.useState({
    series: [
      {
        name: "User",
        data: [4400, 5515, 5747, 5664, 6121, 5348, 6473, 6064, 6446],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 400,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          "01-01",
          "01-02",
          "01-03",
          "01-04",
          "01-05",
          "01-06",
          "01-07",
          "01-08",
          "01-09",
        ],
      },
      yaxis: {
        title: {
          text: "접속 수",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " 명"
          },
        },
      },
    },
  })

  const [state2, setState2] = React.useState({
    series: [
      {
        name: "cpu",
        data: [50, 70, 85, 40, 65, 50, 45, 55, 35],
      },
      {
        name: "files",
        data: [60, 60, 65, 70, 75, 80, 85, 87, 90],
      },
      {
        name: "RAM",
        data: [50, 50, 80, 50, 67, 50, 50, 70, 50],
      },
    ],
    options: {
      chart: {
        height: 400,
        type: "line",
        id: "areachart-2",
      },
      annotations: {
        yaxis: [
          {
            y: 8200,
            borderColor: "#00E396",
            label: {
              borderColor: "#00E396",
              style: {
                color: "#fff",
                background: "#00E396",
              },
              text: "Support",
            },
          },
          {
            y: 80,
            y2: 100,
            borderColor: "#000",
            fillColor: "#FEB019",
            opacity: 0.2,
            label: {
              borderColor: "#333",
              style: {
                fontSize: "10px",
                color: "#333",
                background: "#FEB019",
              },
              text: "사용량 주의 구간",
            },
          },
        ],
        xaxis: [
          {
            x1: new Date("9 Dec 2017").getTime(),
            x2: new Date("11 Dec 2017").getTime(),
            strokeDashArray: 0,
            borderColor: "#775DD0",
            label: {
              borderColor: "#775DD0",
              style: {
                color: "#fff",
                background: "#775DD0",
              },
              text: "성능 테스트",
            },
          },
        ],
        points: [
          {
            x: new Date("10 Dec 2017").getTime(),
            y: 85,
            marker: {
              size: 8,
              fillColor: "#fff",
              strokeColor: "red",
              radius: 2,
              cssClass: "apexcharts-custom-class",
            },
            label: {
              borderColor: "#FF4560",
              offsetY: 0,
              style: {
                color: "#fff",
                background: "#FF4560",
              },

              text: "최고치 구간",
            },
          },
        ],
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      grid: {
        padding: {
          right: 30,
          left: 20,
        },
      },
      title: {
        text: "장비 사용량",
        align: "left",
      },
      labels: [
        new Date("08 Dec 2017").getTime(),
        new Date("09 Dec 2017").getTime(),
        new Date("10 Dec 2017").getTime(),
        new Date("11 Dec 2017").getTime(),
        new Date("12 Dec 2017").getTime(),
        new Date("13 Dec 2017").getTime(),
        new Date("14 Dec 2017").getTime(),
        new Date("15 Dec 2017").getTime(),
        new Date("16 Dec 2017").getTime(),
      ],
      xaxis: {
        type: "datetime",
      },
    },
  })

  const [state3, setState3] = React.useState({
    series: [
      {
        data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 400,
      },
      plotOptions: {
        bar: {
          barHeight: "100%",
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: "bottom",
          },
        },
      },
      colors: [
        "#33b2df",
        "#546E7A",
        "#d4526e",
        "#13d8aa",
        "#A5978B",
        "#2b908f",
        "#f9a3a4",
        "#90ee7e",
        "#f48024",
        "#69d2e7",
      ],
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#fff"],
        },
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
        },
        offsetX: 0,
        dropShadow: {
          enabled: true,
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: [
          "South Korea",
          "Canada",
          "United Kingdom",
          "Netherlands",
          "Italy",
          "France",
          "Japan",
          "United States",
          "China",
          "India",
        ],
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      title: {
        text: "화면별 사용량",
        align: "center",
        floating: true,
      },
      subtitle: {
        text: "Category Names as DataLabels inside bars",
        align: "center",
      },
      tooltip: {
        theme: "dark",
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function () {
              return ""
            },
          },
        },
      },
    },
  })
  return (
    <>
      <Row gutter={10}>
        <Col span={8}>
          <Card variant="outlined" style={{ height: "400px" }}>
            <Statistic title="금일 접속 유저수 " value={2130}></Statistic>
            <ReactApexChart
              options={state.options}
              series={state.series}
              type="bar"
            />
          </Card>
          <Card
            variant="outlined"
            style={{ marginTop: "20px", height: "400px" }}
          >
            <ReactApexChart
              options={state2.options}
              series={state2.series}
              type="line"
              height={360}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card variant="outlined" style={{ height: "400px" }}>
            <ReactApexChart
              options={state3.options}
              series={state3.series}
              type="bar"
              height={350}
            />
          </Card>
          <Card
            variant="outlined"
            style={{ marginTop: "20px", height: "400px" }}
          >
            <ReactApexChart
              options={state2.options}
              series={state2.series}
              type="line"
              height={360}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="바로가기"
            variant="borderless"
            style={{ height: "400px" }}
          >
            <Row gutter={10}>
              <Col span={12}>
                <Badge count={100}>
                  <Avatar shape="square" size={50} icon={<EditOutlined />} />
                </Badge>
                결재요청
              </Col>
              <Col span={12}>
                <Badge count={100}>
                  <Avatar shape="square" size={50} icon={<FormOutlined />} />
                </Badge>
                결재신청
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <div style={{ marginTop: "20px" }}>
                  <Badge count={100}>
                    <Avatar shape="square" size={50} icon={<AlertOutlined />} />
                  </Badge>
                  알림
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginTop: "20px" }}>
                  <Badge count={100}>
                    <Avatar
                      shape="square"
                      size={50}
                      icon={<MessageOutlined />}
                    />
                  </Badge>
                  메시지
                </div>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <div style={{ marginTop: "20px" }}>
                  <Badge count={100}>
                    <Avatar
                      shape="square"
                      size={50}
                      icon={<CalendarOutlined />}
                    />
                  </Badge>
                  일정
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginTop: "20px" }}>
                  <Badge count={100}>
                    <Avatar
                      shape="square"
                      size={50}
                      icon={<NotificationOutlined />}
                    />
                  </Badge>
                  공지사항
                </div>
              </Col>
            </Row>
          </Card>
          <Card
            variant="outlined"
            style={{ marginTop: "20px", height: "400px" }}
          >
            <ReactApexChart
              options={state2.options}
              series={state2.series}
              type="line"
              height={360}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Dashboard
