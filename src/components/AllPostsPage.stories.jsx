
import AllPostsPage from './AllPostsPage';

export default {
  title: 'Pages/AllPostsPage',
  component: AllPostsPage,
};

const Template = (args) => <AllPostsPage {...args} />;

export const Default = Template.bind({});
Default.args = {};
