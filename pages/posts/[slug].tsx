import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { GetStaticProps, GetStaticPaths } from 'next';

type Props = {
    post: Post;
}

export const getStaticPaths: GetStaticPaths = async () => {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const filenames = fs.readdirSync(postsDirectory);
    const paths = filenames.map(filename => {
        return {
            params: {
                slug: filename.replace(/\.md$/, '')
            }
        }
    });

    return {
        paths,
        fallback: false
    }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const slug = params?.slug ?? '';
    const filePath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const matterResult = matter(fileContents);
    const processedContent = remark().use(html).processSync(matterResult.content).toString();

    return {
        props: {
            post: {
                title: matterResult.data.title,
                date: matterResult.data.date,
                content: processedContent,
                slug: String(slug)
            }
        }
    }
};

export default function PostPage({ post }: Props) {
    return (
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h1 className='text-4xl font-bold'>{post.title}</h1>
            <p className='text-gray-700 text-base'>{post.date}</p>
            <div className='mt-4 text-gray-700 text-base' dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </div>
    )
}