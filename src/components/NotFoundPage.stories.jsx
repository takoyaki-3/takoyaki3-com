
import NotFoundPage from './NotFoundPage';

export default {
  title: 'Pages/NotFoundPage',
  component: NotFoundPage,
};

const Template = (args) => <NotFoundPage {...args} />;

export const Default = Template.bind({});
Default.args = {};
