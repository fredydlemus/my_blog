import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { GetStaticProps } from 'next';
import Link from 'next/link';

type Props = {
  posts: Post[];
};


export const getStaticProps: GetStaticProps<Props> = async () => {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);
  const posts = filenames.map(filename => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const matterResult = matter(fileContents);
    const processedContent = remark().use(html).processSync(matterResult.content).toString();
    const slug = filename.replace(/\.md$/, '');

    return {
      title: matterResult.data.title,
      date: matterResult.data.date,
      content: processedContent,
      slug
    }
  });

  return {
    props: {
      posts
    }
  }
}

export default function Home({ posts }: Props) {
  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='divide-y divide-gray-200'>
        {posts.map((post) => (
          <Link key={post.slug} href={`/posts/${post.slug}`}>
            <div key={post.title} className="py-8 flex flex-col lg:flex-row">
              <div className='lg:w-1/3'>
                <img className='h-48 lg:h-auto lg:w-64 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden' src="https://picsum.photos/640/480/?random" alt="" />
              </div>
              <div className='lg:w-2/3 p-4'>
                <h2 className='text-2xl font-bold mb-2'>{post.title}</h2>
                <p className='text-gray-700 text-base'>{post.date}</p>
                <div className='mt-4 text-gray-700 text-base' dangerouslySetInnerHTML={{ __html: post.content }}></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}