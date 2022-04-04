import type { NextPage } from 'next'
import Head from 'next/head'
import { sanityClient, urlFor } from '../sanity'
import Header from '../components/Header'
import { Post } from '../typings'
import Link from 'next/link'

interface Props {
  posts: [Post]
}

export default function Home({ posts }: Props) {
  // console.log(posts)

  return (
    <div className=" w-full bg-gray-200 p-5">
      <Head>
        <title>Natachi-js Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3 ">
        {posts.map((post) => (
          <Link href={`/post/${post.slug.current}`} key={post._id}>
            <div className=" group cursor-pointer shadow-xl">
              <img
                src={urlFor(post.mainImage).url()!}
                className=" h-60 w-full object-cover group-hover:scale-100"
                alt=""
              />
              <div className="bg-stone-850 flex justify-between p-5">
                <div>
                  <p>{post.title}</p>
                  <p>
                    {post.description} by {post.author.name}{' '}
                  </p>
                </div>
                <img
                  className="h-12 w-12 rounded-full bg-white"
                  src={urlFor(post.author.image).url()!}
                  alt=""
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `
  *[_type == 'post']{
  _id, 
  title,
  description,
  mainImage,
  slug,
  author->{
  name,
  image
}
} `

  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
