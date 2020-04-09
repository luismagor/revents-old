import sampleData from './sampleData';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const fetchSampleData = () => {
  return delay(1000).then(() => {
    return Promise.resolve(sampleData);
  });
};
