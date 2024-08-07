import { Layout } from 'antd';
const { Header, Content, Footer } = Layout;
export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout className='h-full'>
      <Content className='w-full h-full'>{children}</Content>
    </Layout>
  );
}
