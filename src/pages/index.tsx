import { GetStaticProps } from 'next';
import {FiCalendar, FiUser} from 'react-icons/fi';
import Header from '.././components/Header'
import Prismic from '@prismicio/client'
import { getPrismicClient } from '../services/prismic';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link'

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useEffect, useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postPagination: PostPagination;
}

export default function Home({postPagination}: HomeProps) {
  const [posts, setPosts] = useState([])
  const [nextPage, setNextPage] = useState('')
  
  useEffect(() => {
    if (postPagination) {
      setPosts(postPagination.results)
      setNextPage(postPagination.next_page)
    }
  }, []) 
 
  const loadMore = async () => {
    fetch(nextPage)
      .then(response => response.json())
      .then(data => {
          setNextPage(data.results.next_page)
          data.results.map((post) => {
            post.first_publication_date = format(
              new Date(post.first_publication_date),"dd MMM yyyy",{locale: ptBR,}
            )

            setPosts([...posts, post])
        })
        
      })
  }

  return (
    <div className={styles.homeContainer}>
      <Header />
      <main >
        <div  className={styles.postsContainer}>
          {posts.map((post) => (
            <Link key={post.uid} href={`post/${post.uid}`}>
              <a>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <div className={styles.infoContainer}>
                  <time><FiCalendar className={commonStyles.icon}/> {post.first_publication_date}</time>
                  <span><FiUser className={commonStyles.icon}/> {post.data.author}</span>
                </div>
              </a>
            </Link>
          ))}          
          {nextPage && <a href="#" onClick={() => loadMore()}>Carregar mais posts</a>}
        </div>
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.Predicates.at('document.type', 'post')
  ], {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 2,
  })

  postsResponse.results.map((post) => {
    post.first_publication_date = format(
        new Date(post.first_publication_date),
        "dd MMM yyyy",
        {
          locale: ptBR,
        }
      )
    return 
  })


  return {
    props: {
      postPagination: {
        next_page: postsResponse.next_page,
        results: postsResponse.results
      }
    }
  }
};
