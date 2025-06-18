import { getClientPromise } from '@/utils/mongodb';

export async function getFaqs(locationKey?: string) {
  const client = await getClientPromise();
  const db = client.db('streetsupport');

  const query: any = {};
  if (locationKey) {
    query.LocationKey = locationKey;
  }

  const faqs = await db
    .collection('FAQs')
    .find(query)
    .project({
      _id: 1,
      LocationKey: 1,
      Title: 1,
      Body: 1,
      SortPosition: 1,
      Tags: 1,
    })
    .sort({ SortPosition: 1 })
    .toArray();

  return faqs.map(faq => ({
    _id: faq._id,
    locationKey: faq.LocationKey,
    title: faq.Title,
    body: faq.Body,
    sortPosition: faq.SortPosition,
    tags: faq.Tags,
  }));
}
