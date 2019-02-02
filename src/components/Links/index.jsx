import React from 'react'
import './style.scss'
import '../../assets/fonts/fontello-b17d47da/css/fontello.css'

class Links extends React.Component {
  render() {
    const author = this.props.data
    const links = {
      name: author.name,
      twitter: author.twitter,
      github: author.github,
      linkedin: author.linkedin,
      instagram: author.instagram,
      flickr: author.flickr,
      goodreads: author.goodreads,
      stackoverflow: author.stackoverflow,
      stackexchange: author.stackexchange,
      rss: author.rss,
    }

    return (
      <div className="links">
        <ul className="links__list">
          <li className="links__list-item">
            <a
              href={`${links.github}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="icon-github" />
            </a>
          </li>
          <li className="links__list-item">
            <a
              href={`${links.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="icon-linkedin-squared" />
            </a>
          </li>
          <li className="links__list-item">
            <a
              href={`${links.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="icon-twitter" />
            </a>
          </li>
          <li className="links__list-item">
            <a
              href={`${links.goodreads}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="icon-book" />
            </a>
          </li>
        </ul>
        <ul className="links__list">
          <li className="links__list-item">
            <a
              href={`${links.stackoverflow}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="icon-stackoverflow" />
            </a>
          </li>
          <li className="links__list-item">
            <a
              href={`${links.stackexchange}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="icon-stackexchange" />
            </a>
          </li>
          <li className="links__list-item">
            <a
              href={`${links.flickr}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="icon-flickr" />
            </a>
          </li>
          <li className="links__list-item">
            <a
              href={`${links.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="icon-instagram" />
            </a>
          </li>
        </ul>
        <ul className="links__list">
          <li className="links__list-item">
            <a
              href={`${links.rss}`}
              rel="noopener noreferrer"
            >
              <i className="icon-rss" />
            </a>
          </li>
        </ul>
      </div>
    )
  }
}

export default Links
