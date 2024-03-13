import { useEffect } from 'react';
import './App.css'
import { PostCard } from './components/PostCard';
import { IPost } from './types/i-post';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

function App() {
  const { ref, inView } = useInView();

  const fetchPosts = async ({pageParam}: {pageParam: number}) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=7`);
    return res.json();
  }

  const {data, status, error, fetchNextPage, isFetchingNextPage, hasNextPage} = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // return allPages.length + 1;
      const nextPage = lastPage.length ? allPages.length + 1 : undefined;
      return nextPage;
    }
  })

  const content = data?.pages.map((posts: IPost[]) =>
    posts.map((post => {
      return <PostCard key={post.id} post={post} />
    }))
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'pending') {
    return <p>Loading data...</p>
  }

  if (status === 'error') {
    return <p>Error: {error.message}</p>
  }

  return (
    <div className='container my-3'>
      <h1 className='mb-5'>React Infinite Scrolling Demo</h1>

      <div className='row g-0 justify-content-center gap-3'>
        {content}
      </div>

      <div hidden={isFetchingNextPage} ref={ref}>
        <h2 className='text-center my-5'>
          {isFetchingNextPage ? "Loadig More..." : (hasNextPage ? "Load More Data" : "All Data Loaded")}
        </h2>
      </div>
    </div>
  )
}

export default App
