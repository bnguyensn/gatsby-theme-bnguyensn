import React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import Layout from '../components/layout';

export default function Items() {
  const data = useStaticQuery(graphql`
    query {
      allItem(sort: { fields: name, order: ASC }) {
        totalCount
        nodes {
          id
          name
          type
          effect
          slug
        }
      }
    }
  `);

  const items = data.allItem.nodes.map(({ id, name, type, effect, slug }) => (
    <li key={id}>
      <div>
        ID: <Link to={slug}>{id}</Link>
      </div>
      <div>Name: {name}</div>
      <div>Type: {type}</div>
      <div>Effect: {effect}</div>
    </li>
  ));

  return (
    <Layout>
      <h1>Items page</h1>
      <div>
        <ul>{items}</ul>
      </div>
    </Layout>
  );
}
