import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';

export const query = graphql`
  query($itemId: String!) {
    item(id: { eq: $itemId }) {
      id
      name
      type
      effect
      slug
    }
  }
`;

export default function Item({ data }) {
  const { id, name, type, effect, slug } = data.item;

  return (
    <Layout>
      <h1>Single, 1 item page</h1>
      <h2>
        <Link to={'/'}>Go home</Link>
      </h2>
      <div>
        ID: <Link to={slug}>{id}</Link>
      </div>
      <div>Name: {name}</div>
      <div>Type: {type}</div>
      <div>Effect: {effect}</div>
    </Layout>
  );
}
