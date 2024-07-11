let newsList = [];
let url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`) // 전역변수로 빼줌

const searchInput = document.getElementById("search-input")
const menus = document.querySelectorAll(".menus button");
const getNews = async () => {
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render(); 
}

menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

searchInput.addEventListener("keydown", (event)=>{
    if(event.key === "Enter") {
        getNewsByKeyword(event)
    }
});

// API 호출
const getLatestNews = async () => {
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
  );
  getNews(); // 리펙토링
};
getLatestNews();

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
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "none") {
    // 기본값을 none으로 설정
    inputArea.style.display = "inline"; // 클릭했을때 검색창 나타남
  } else {
    inputArea.style.display = "none"; // 한번 더 클릭하면 검색창 사라짐
  }
};

// 뉴스창 생성 함수
const render = () => {
  let newsHTML = newsList
    .map(
      (news) => `<div class="row news">
    <div class="col-lg-4 left">
        <img class="news-image-size" src=${news.urlToImage} 
        alt=${news.title} 
        onerror="this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU'; this.onerror=null;"/>
    </div>
    <div class="col-lg-8 right">
        <h2>${news.title}</h2>
        <p>
        ${news.description == null || news.description == ""
            ? "내용없음"
            : news.description.length >= 200
            ? news.description.substring(0, 200) + "..." // slice()와 가능 같음
            : news.description
        }
        </p>
        <div>
        ${news.source.name || "no source"} ${moment(news.publishedAt).fromNow()}
        </div>
    </div>
    </div>`
    )
    .join("");
  document.getElementById("news-board").innerHTML = newsHTML;
};

// 카테고리별 검색함수
const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase(); // 소문자로 변경
  console.log("category", category);
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`
  );
  getNews();
};

// 키워드별 검색 함수
const getNewsByKeyword = async () => {
  const keyword = searchInput.value;
  console.log("keyword", keyword);
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`
  );
  searchInput.value = "";
  getNews();
};
