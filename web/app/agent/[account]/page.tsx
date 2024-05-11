export default function Home({ params }: { params: { account: string } }) {
  return (
    <div>
      <h1>Agent Page</h1>
      <p>Account: {params.account}</p>
    </div>
  );
}
