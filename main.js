let newsList = [] 

// API 호출
const getLatestNews = async () =>{
    let url = new URL(` https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`) 
    const response = await fetch(url)
    const data = await response.json()
    newsList = data.articles
    render() // 뉴스리스트가 확정되면 바로 함수 실행
    console.log("d", newsList)
}
getLatestNews() 

// 사이드바 열기 함수
const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
  };
  
// 사이드바 닫기 함수  
const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
  };

// 검색창 열기 함수
const openSearchBox = () => {
    let inputArea = document.getElementById("input-area")
    if (inputArea.style.display === "none") { // 기본값을 none으로 설정
        inputArea.style.display = "inline" // 클릭했을때 검색창 나타남
    } else {
        inputArea.style.display = "none" // 한번 더 클릭하면 검색창 사라짐
    }
}

// 뉴스창 생성 함수
const render = () => {
    let newsHTML = newsList.map(news=> `<div class="row news">
    <div class="col-lg-4">
        <img class="news-image-size" src=${news.urlToImage} onerror="this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU'; this.onerror=null;" />
    </div>
    <div class="col-lg-8">
        <h2>${news.title}</h2>
        <p>
        ${news.description == null || news.description == ""
            ?"내용없음":
            news.description.length >= 200
            ?news.description.substring(0,200) + "...":  // slice()와 가능 같음
            news.description
        }
        </p>
        <div>
        ${news.source.name || "no source"} ${moment(news.publishedAt).fromNow()}
        </div>
    </div>
    </div>`
    ).join('')
    document.getElementById("news-board").innerHTML = newsHTML;
}