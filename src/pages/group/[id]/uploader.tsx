import Layout from "@/components/Layout";
import GroupImageCrawler from "@/components/GroupImageCrawler";
import { GetServerSideProps, NextPage } from "next";

interface Props {
  groupId: number;
}

const emptyResponse = {
  props: {
    groupId: -1,
  },
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { id } = context.query;
  if (typeof id !== "string") {
    return emptyResponse;
  }
  return {
    props: {
      groupId: parseInt(id),
    },
  };
};

const GroupUploader: NextPage<Props> = (props: Props) => {
  return (
    <Layout>
      <GroupImageCrawler groupId={props.groupId} />
    </Layout>
  );
};
export default GroupUploader;
