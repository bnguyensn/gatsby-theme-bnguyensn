const fs = require('fs');

// The second argument is an object containing the parameters passed to the top-
// level gatsby-config.js
exports.onPreBootstrap = ({ reporter }, { contentPath }) => {
  // Make sure the data directory exists
  if (!fs.existsSync(contentPath)) {
    reporter.info(`creating the ${contentPath} directory`);
    fs.mkdirSync(contentPath);
  }
};

// Define the "Item" type
exports.sourceNodes = ({ actions }) => {
  actions.createTypes(`
    type Item implements Node @dontInfer {
      id: ID!
      name: String!
      type: String!
      effect: String!
      slug: String!
    }
  `);
};

// Define resolvers for custom fields
// The second argument is an object containing the parameters passed to the top-
// level gatsby-config.js
exports.createResolvers = ({ createResolvers }, { basePath }) => {
  // Quick-and-dirty helper to convert strings into URL-friendly slugs.
  const slugify = str => {
    const slug = str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    return `/${basePath}/${slug}`.replace(/\/\/+/g, '/');
  };

  createResolvers({
    Item: {
      slug: {
        resolve: source => slugify(source.name),
      },
    },
  });
};

// Query for items and create pages
// The second argument is an object containing the parameters passed to the top-
// level gatsby-config.js
exports.createPages = async ({ actions, graphql, reporter }, { basePath }) => {
  actions.createPage({
    path: basePath,
    component: require.resolve('./src/templates/items.js'),
  });

  const result = await graphql(`
    query {
      allItem(sort: { fields: name, order: ASC }) {
        nodes {
          id
          slug
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panic('Error loading items', result.errors);
    return;
  }

  const items = result.data.allItem.nodes;

  items.forEach(item => {
    const { slug, id } = item;

    actions.createPage({
      path: slug,
      component: require.resolve('./src/templates/item.js'),
      context: {
        itemId: id,
      },
    });
  });
};
