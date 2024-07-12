let newsList = [];
let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
);

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const menus = document.querySelectorAll(".menus button");
const defaultImage =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU";

// 뉴스 API 호출
const getNews = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("뉴스 결과가 없습니다.");
      }
      newsList = data.articles;
      render();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

// API 호출
const getLatestNews = async () => {
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
  );
  await getNews(); // 리펙토링
};
getLatestNews();

// 뉴스창 생성
const render = () => {
  let newsHTML = newsList
    .map(
      (news) => `<div class="row news">
    <div class="col-lg-4 left">
        <img class="news-image-size" src=${news.urlToImage || defaultImage} 
        alt=${news.title} 
        onerror="this.onerror=null; this.src='${defaultImage}'; "/>
    </div>
    <div class="col-lg-8 right">
        <h2>${news.title}</h2>
        <p>
        ${
          news.description == null || news.description == ""
            ? "내용없음"
            : news.description.length >= 100
            ? news.description.substring(0, 100) + "..."
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

// 에러 함수
const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
    ${errorMessage}
    </div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
};

// 카테고리별 검색
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);
const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  console.log("category", category);
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`
  );
  await getNews(); // 리펙토링
};

// 키워드별 검색
searchButton.addEventListener("click", () => {
  if (searchInput.value === "") {
    alert("키워드를 입력하세요!");
  }
});
const getNewsByKeyword = async () => {
  const keyword = searchInput.value;
  console.log("keyword", keyword);
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`
  );
  await getNews(); // 리펙토링
};

// 엔터키 입력
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && searchInput.value !== "") {
    getNewsByKeyword(event);
  }
});

// 클릭하면 인풋창 비워짐
searchInput.addEventListener("focus", () => {
  searchInput.value = "";
});

// 사이드바 열기
const openNav = () => {
  document.getElementById("mySidenav").style.width = "200px";
};

// 사이드바 닫기
const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};

// 검색창 열기
const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "none") {
    inputArea.style.display = "inline";
  } else {
    inputArea.style.display = "none";
  }
};
