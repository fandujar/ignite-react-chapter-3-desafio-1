import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client'

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import {FiCalendar, FiUser, FiClock} from 'react-icons/fi';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

import Header from '../../components/Header'
import { useRouter } from 'next/router';

import {Utterances} from '../../components/Utterances'

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({post}: PostProps) {
  const {isFallback} = useRouter();

  const calculateReadTime = (text: string[]) => {
    return (text.length / 200)
  }
    
  let readTime:number = 0;

  if (post) {
    post?.data.content.map(content => {
      readTime += calculateReadTime(content?.heading?.split(' '));
      content?.body.map(body => {
        readTime += calculateReadTime(body?.text?.split(' '))
      })
    })
  }

  readTime = Math.ceil(readTime)

  return (
    <>
      <Header />
      <main className={styles.postContainer}>
        {isFallback ? (<div className={styles.postLoading}>Carregando...</div>)
        : (<>
          <section>
            <div className={styles.postBannerContainer}>
              <img src={post?.data.banner.url} alt={post?.data.title}/>
            </div>
            <div className={styles.postHeaderContainer}>
              <strong>{post?.data.title}</strong>
              <div className={commonStyles.infoContainer}>
                      <time><FiCalendar className={commonStyles.icon}/>{post?.first_publication_date}</time>
                      <span><FiUser className={commonStyles.icon}/>{post?.data.author}</span>
                      <span><FiClock className={commonStyles.icon}/>{readTime} min</span>
              </div>
            </div>
          </section>
          <section className={styles.postContentContainer}>
            {post?.data.content.map((content) => (
            <div key={content.heading}>
              <strong>{content.heading}</strong>
              {content?.body.map(body => (
                <pre key={body.text}>
                  {body.text}
                </pre>
              ))}
            </div>
            ))}
            <Utterances
              repo="fandujar/ignite-react-chapter-3-desafio-1"
              issueTerm="url"
              label="blog-comments"
              theme="github-dark"
              crossorigin="anonymous"
             />
          </section>
          </>)}
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'post')
  ], {
      fetch: ['post.uid'],
  });

  return {
      paths: posts.results.map(post => ({params: {slug: post.uid}})),
      fallback: true
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const {slug} = context.params;
  const prismic = getPrismicClient();
  const post = await prismic.getByUID('post', String(slug), {})

  if (post) {
    post.first_publication_date = format(
      new Date(post.first_publication_date),
      "dd MMM yyyy",
      {
        locale: ptBR,
      }
    )
  }
  
  return {
    props: {
      post
    }
  }
};
