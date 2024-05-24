import Profile from "@/components/agent/profile";

export default function Home({
  params,
}: {
  params: { account: `0x${string}` };
}) {
  return <Profile account={params.account} />;
}
