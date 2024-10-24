import React from 'react';
import TopPage from './TopPage';

export default {
  title: 'Pages/TopPage',
  component: TopPage,
};

const Template = (args) => <TopPage {...args} />;

export const Default = Template.bind({});
Default.args = {};
