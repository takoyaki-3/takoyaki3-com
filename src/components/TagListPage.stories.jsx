import React from 'react';
import TagListPage from './TagListPage';

export default {
  title: 'Pages/TagListPage',
  component: TagListPage,
};

const Template = (args) => <TagListPage {...args} />;

export const Default = Template.bind({});
Default.args = {};
