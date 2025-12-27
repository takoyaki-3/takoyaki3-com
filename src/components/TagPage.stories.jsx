import TagPage from './TagPage';
import { BrowserRouter as Router } from 'react-router-dom';

export default {
  title: 'Pages/TagPage',
  component: TagPage,
};

const Template = (args) => (
  <Router>
    <TagPage {...args} />
  </Router>
);

export const Default = Template.bind({});
Default.args = {};
