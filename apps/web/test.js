
(async () => {
    const response = await fetch(
        "https://api.ossinsight.io/v1/trends/repos/",
    );
    const { data } = await response.json();
    console.log(data.rows, '.....')
})()
