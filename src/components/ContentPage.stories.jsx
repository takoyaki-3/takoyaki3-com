
import ContentPage from './ContentPage';
import { BrowserRouter as Router } from 'react-router-dom';

export default {
  title: 'Pages/ContentPage',
  component: ContentPage,
};

const Template = (args) => (
  <Router>
    <ContentPage {...args} />
  </Router>
);

export const Default = Template.bind({});
Default.args = {};
