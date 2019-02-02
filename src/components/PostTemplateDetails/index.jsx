import React from 'react'
import { Link } from 'gatsby'
import moment from 'moment'
import 'moment/locale/pl'
import Disqus from '../Disqus/Disqus'
import './style.scss'

class PostTemplateDetails extends React.Component {
  render() {
    const { subtitle, author } = this.props.data.site.siteMetadata
    const post = this.props.data.markdownRemark
    const tags = post.fields.tagSlugs

    const homeBlock = (
      <div>
        <Link className="post-single__home-button" to="/">
         Powrót
        </Link>
      </div>
    )

    const tagsBlock = (
      <div className="post-single__tags">
        <ul className="post-single__tags-list">
          {tags &&
            tags.map((tag, i) => (
              <li className="post-single__tags-list-item" key={tag}>
                <Link to={tag} className="post-single__tags-list-item-link">
                  {post.frontmatter.tags[i]}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    )

    const commentsBlock = (
      <div>
        <Disqus
          postNode={post}
          siteMetadata={this.props.data.site.siteMetadata}
        />
      </div>
    )

    return (
      <div>
        {homeBlock}
        <div className="post-single">
          <div className="post-single__inner">
            <h1 className="post-single__title">{post.frontmatter.title}</h1>
            <div
              className="post-single__body"
              /* eslint-disable-next-line react/no-danger */
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
            <div className="post-single__date">
              <em>
                Opublikowano {moment(post.frontmatter.date).format('D MMMM YYYY')}
              </em>
            </div>
          </div>
          <div className="post-single__footer">
            {tagsBlock}
            <hr />
            <p className="post-single__footer-text">
              {subtitle}<br />
              <strong>{author.name}</strong>
              &nbsp;&middot;&nbsp;
              <a
                href={`${author.github}`}
                target="_blank"
                rel="noopener noreferrer"
              >GitHub
              </a>
              &nbsp;&middot;&nbsp;
              <a
                href={`${author.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
              >LinkedIn
              </a>
              &nbsp;&middot;&nbsp;
              <a
                href={`${author.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
              >Twitter
              </a>
              &nbsp;&middot;&nbsp;
              <a
                href={`${author.goodreads}`}
                target="_blank"
                rel="noopener noreferrer"
              >Goodreads
              </a>
            </p>
            {commentsBlock}
          </div>
        </div>
      </div>
    )
  }
}

export default PostTemplateDetails
