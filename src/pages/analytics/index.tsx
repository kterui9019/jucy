import { GetStaticProps } from "next";
import { useState, useContext, useEffect } from 'react';
import R from 'ramda';
import {
  VictoryGroup,
  VictoryPie,
  VictoryChart,
  VictoryBar,
  VictoryScatter,
  VictoryTheme,
  VictoryAxis,
} from "victory";

import {
  BarChart, Bar,
  ScatterChart, Scatter,

  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

import { 
  Card,
  CardHeader,
  Grid,
  GridList,
  GridListTile,
  GridListTileBar,
  Typography,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import { Rating } from '@material-ui/lab';

import { AgeAndGender } from "../../types";
import { Data, User } from "../../types";
import { GlobalContext } from '../../utils/context/context';

import { Country, Gender, Age, DoW } from "../../types/analytics";
import { sampleAnalyticData, sampleUserData } from "../../utils/sample-data";
import Layout from "../../components/Layout";
import List from "../../components/List";
import { useStyles } from "../analytics/styles";

type Props = {
  dataCountries: any;
  dataAgeAndGender: any;
  dataWeekActive: any;
  items: User[];
};

export type dataGender = {
  male: dataAge[];
  female: dataAge[];
};

export type dataAge = {
  x: string;
  y: number;
};

const AgeAndGenderChart = ({ data }: dataAgeAndGender) => {
  return (
    <BarChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="male" fill="#8884d8" />
      <Bar dataKey="female" fill="#82ca9d" />
    </BarChart>
  );
};

const WeekHourTimeActive = ({ data }: dataWeekActive) => {
   const renderTooltip = (props) => {
    const { active, payload } = props;

    if (active && payload && payload.length) {
      const data = payload[0] && payload[0].payload;

      return (
        <div style={{
          backgroundColor: '#fff', border: '1px solid #999', margin: 0, padding: 10,
        }}
        >
          <p>
            <span>時間帯: </span>
            {data.hour}
          </p>
          <p>
            <span>視聴率: </span>
            {data.amount}
          </p>
        </div>
      );
    }

    return null;
  }

  const parseDomain = () => [
    0,
    Math.max(
      Math.max.apply(null, data01.map(entry => entry.value)),
      Math.max.apply(null, data02.map(entry => entry.value))
    ),
  ];

  const domain = [0, Math.max()];
  const range = [16, 225];
  return (
    <div>
      {data.map((item) => (
        <ScatterChart
          width={800}
          height={60}
          margin={{
            top: 10,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        >
          <XAxis
            type="category"
            dataKey="hour"
            interval={0}
            tick={{ fontSize: 0 }}
            tickLine={{ transform: "translate(0, -6)" }}
          />
          <YAxis
            type="number"
            dataKey="index"
            name={item.day}
            height={10}
            width={80}
            tick={false}
            tickLine={false}
            axisLine={false}
            label={{ value: item.day, position: "insideRight" }}
          />
          <ZAxis type="number" dataKey="value" domain={domain} range={range} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            wrapperStyle={{ zIndex: 100 }}
            content={this.renderTooltip}
          />
          <Scatter data={data01} fill="#8884d8" />
        </ScatterChart>
      ))}
    </div>
  );
}

const WithStaticProps = ({
  items,
  dataCountries,
  dataAgeAndGender,
  dataWeekActive,
}: Props) => {
  const { channels } = useContext(GlobalContext);
  if(!channels) { return; }
  console.log('おおおおおおおおおおおおおおおあじゃじゃじゃｊ', channels);
  const classes = useStyles();
  return (
    <Layout title="Analytics | Jucy">
      <Grid classes={classes.root} container spacing={10}>
        <Grid item xs={12}>
          <Grid container xs={12}>
            <Avatar alt="Remy Sharp" src={channels[0]?.thumbnail || ''} />
            <Typography variant="h2">
              {channels[0].title}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Card valiant="outlined">
            <CardHeader title="チャンネル登録者数" />
            <Typography variant="h3">
              {channels[0]?.subscriberCount || 100000}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card valiant="outlined">
            <CardHeader title="総視聴者数" />
            <Typography variant="h3">
              {channels[0]?.subscriberCount || 100000000}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card valiant="outlined">
            <CardHeader title="地域" />
          </Card>
        </Grid>

          <Card valiant="outlined">
            <CardHeader title="地域" />
            <VictoryPie
              theme={VictoryTheme.material}
              data={dataCountries}
              animate={{
                duration: 2000,
              }}
            />
          </Card>

        <Card>
          <CardHeader title="年齢・男女比" />
          <AgeAndGenderChart data={dataAgeAndGender} />
        </Card>

        <Grid item xs={6}>
          <Card>
            <CardHeader title="曜日・時間ごとの視聴率" />
            {/* <WeekHourTimeActive data={dataWeekActive} /> */}
            <VictoryChart
              theme={VictoryTheme.material}
              domain={{ x: [0, 8], y: [0, 25] }}
            >
              <VictoryScatter
                style={{ data: { fill: "#c43a31" } }}
                bubbleProperty="amount"
                maxBubbleSize={5}
                minBubbleSize={1}
                data={dataWeekActive}
              />
            </VictoryChart>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export const getServerSideProps: GetStaticProps = async () => {
  const items: User[] = sampleUserData;
  const data: Data = sampleAnalyticData;

  const dataCountries: Array<object> = data.items[0].viewPercentWithCountry.map(
    (item: Array<string | number>) => {
      return {
        x: Country[item[0]],
        y: item[1],
      };
    }
  );

  const dataAgeAndGender = data.items[0].ageAndGenderWithViewPercent.reduce((
    acc: dataGender, curVal: AgeAndGender
  ) => {
    if (curVal[1] == 'female') {
      acc.push({
        name: curVal[0].slice(3, 6),
        female: curVal[2],
      });
    } else {
      acc[acc.length -1]['male'] = curVal[2];
    }
    return acc;
  }, []);

  const dataWeekActive = Object.keys(data.items[0].weekActive).reduce(
    (accumulator, currentValue) => {
      return accumulator.concat(
        Object.keys(data.items[0].hourTimeActive).map((itemHour) => {
          return {
            x: DoW[currentValue],
            y: Number(itemHour),
            amount:
              data.items[0].weekActive[currentValue] *
              data.items[0].hourTimeActive[itemHour],
          };
        })
      );
  }, []);
  return {
    props: {
      items,
      dataCountries,
      dataAgeAndGender,
      dataWeekActive,
    },
  };
};

export default WithStaticProps;
