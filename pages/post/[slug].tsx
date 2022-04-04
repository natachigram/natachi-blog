import { useState } from 'react'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import { GetStaticProps } from 'next'
import PortableText from 'react-portable-text'
import { Children } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

interface IformInput {
  _id: string
  name: string
  email: string
  comment: string
}

//define our prop types
interface Props {
  post: Post
}

function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IformInput>()

  const onSubmit: SubmitHandler<IformInput> = async (data) => {
    await fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data)
        setSubmitted(true)
      })
      .catch((err) => {
        console.log(err)
        setSubmitted(false)
      })
  }

  return (
    <main className="">
      <img
        className="h-60 w-full object-cover"
        src={urlFor(post.mainImage).url()}
        alt="blog image with chrome extension logo"
      />

      <article className="mx-auto max-w-3xl p-5">
        <h1 className="mt-10 mb-3 text-3xl"> {post.title} </h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>

        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt="photo of article author"
          />
          <p className="font-extraLight text-sm">
            Blog post by {post.author.name} - published at{' '}
            {new Date(post._createdAt).toLocaleString()}{' '}
          </p>
        </div>
        <div>
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            className=""
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="my-5 text-xl font-bold" {...props} />
              ),
            }}
          />
        </div>
      </article>
      <hr className="my-5 mx-auto max-w-lg border border-yellow-500" />

      {submitted ? (
        <div className="my-10 mx-auto flex max-w-2xl flex-col bg-yellow-500 p-10 text-white">
          <h3 className="flex text-3xl font-bold">
            Thanks for submitting your comment
            <img src="https://img.icons8.com/fluency/40/000000/filled-like.png" />
          </h3>
          <p>Once its been approved it will appear below</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" mx-auto mb-10 flex max-w-2xl flex-col p-5 "
        >
          <h3 className=" text-sm text-yellow-500 ">
            Did you learn something new?
          </h3>
          <h4 className=" text-3xl font-bold">Leave a comment below</h4>
          <hr className="mt-2 py-3" />

          <input
            {...register('_id')}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="mb-5 block">
            <span className="text-gray-700">Name</span>
            <input
              {...register('name', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              placeholder="Moyin Nna"
              type="text"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Email</span>
            <input
              {...register('email', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              placeholder="joedoe@example.com"
              type="text"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className=" form-textarea mt-1  block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              placeholder="Enter comments here"
              rows={8}
            />
          </label>

          <div className=" flex flex-col p-5 ">
            {/* errors will return when field validation fails  */}
            {errors.name && (
              <span className="text-red-500">The name field is required</span>
            )}
            {errors.email && (
              <span className="text-red-500">The email field is required</span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                The comment field is required
              </span>
            )}
          </div>

          <input
            type="submit"
            value="Submit"
            className="focus:shadow-outline cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold text-white shadow hover:bg-yellow-400 focus:outline-none"
          />
        </form>
      )}

      {/* comments */}
      <div className="my-10 mx-auto flex max-w-2xl flex-col space-y-2 p-10 shadow shadow-yellow-500">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-yellow-500"> {comment.name}</span> :
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Post

//get data using next gstp. telling  nextjs which pages to ahead and prepare

export const getStaticPaths = async () => {
  const query = `*[_type == 'post']{
        _id,
        slug{
            current
        }
    }`

  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

//telling nextjs to when it trys to prepare that page; how does it use e.g slug
//to actually  fetch the post/information

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author->{
            name,
            image
        },
        'comments': *[
            _type == "comment" &&
            post._ref == ^._id && 
            approved == true],
        description,
        mainImage,
        slug,
        body
    }`

  const post = await sanityClient.fetch(query, { slug: params?.slug })

  //to redirect to 404 if didnt fetch the post
  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60, // after 60 secs it should update the cache
  }
}
