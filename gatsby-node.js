/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require("path")

const { createFilePath } = require("gatsby-source-filesystem")
const { fmImagesToRelative } = require("gatsby-remark-relative-images")

exports.onCreateNode = ({ node, getNode, actions }) => {
  if (node.internal.type === `MarkdownRemark`) {
    fmImagesToRelative(node)
    const { createNodeField } = actions
    const slug = createFilePath({
      node,
      getNode,
    })
    createNodeField({
      node,
      name: `slug`,
      value: `/projects${slug}`,
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `).then(result => {
    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: path.resolve("./src/templates/project/project.js"),
        context: {
          slug: node.fields.slug,
        },
      })
    })
  })
}
