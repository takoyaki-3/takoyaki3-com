import React from 'react';
import RamenGallery from './RamenGallery';

export default {
  title: 'Components/RamenGallery',
  component: RamenGallery,
};

const Template = (args) => <RamenGallery {...args} />;

export const Default = Template.bind({});
Default.args = {
  photos: [
    { url: 'https://mall.premium-water.net/img/goods/L/KWK-007_0d46f33720c843c18b67bd9cd4922e39.jpg' },
    { url: 'https://mall.premium-water.net/img/goods/L/KWK-007_0d46f33720c843c18b67bd9cd4922e39.jpg' },
    { url: 'https://mall.premium-water.net/img/goods/L/KWK-007_0d46f33720c843c18b67bd9cd4922e39.jpg' },
    { url: 'https://mall.premium-water.net/img/goods/L/KWK-007_0d46f33720c843c18b67bd9cd4922e39.jpg' },
    { url: 'https://mall.premium-water.net/img/goods/L/KWK-007_0d46f33720c843c18b67bd9cd4922e39.jpg' },
  ],
};
