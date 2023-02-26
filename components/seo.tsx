import Head from "next/head";

export default function HeadComponent() {
    return (
        <Head>
            <title>Conway Game of Life</title>
            <meta
                name="description"
                content="Conway Game of Life"
            />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    );
}