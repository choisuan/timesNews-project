// const API_KEY = '배정받은 키값'
let newsList = [];
let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
);
let totalResults = 0
let page = 1
const pageSize = 10
const groupSize = 5
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const menus = document.querySelectorAll(".menus button");
const defaultImage =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU";

// 뉴스 API 호출
const getNews = async () => {
  try {
    url.searchParams.set("page",page) // &page=page
    url.searchParams.set("pageSize",pageSize) // url 호출 전에 파라미터 붙임

    const response = await fetch(url);
    const data = await response.json();
    console.log(data)
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("뉴스 결과가 없습니다.");
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender(); // 뉴스가 나오고 페이지네이션도 같이 나옴
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
        <a class="title" target="_blank" href="${news.url}">${news.title}</a>
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
  moveToPage(1);
  closeNav();
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
  document.getElementById("mySidenav").style.width = "250px";
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

// 페이지네이션
const paginationRender = () => {
    const totalPages = Math.ceil(totalResults / pageSize) // 총 페이지 수
    const lastGroup = Math.ceil(totalPages / groupSize) // 마지막 페이지 그룹
    let pageGroup = Math.ceil(page / groupSize) // 현재 페이지가 어떤 그룹에 속해있는지
    let lastPage = pageGroup * groupSize // 현재 페이지가 속한 그룹의 마지막 페이지
        if(lastPage > totalPages) { // 페이지수가 5개 이하면 페이지수만큼 보여줌
            lastPage = totalPages   // 마지막 그룹이 5개 이하면 마지막 페이지 숫자에 맞춰 5개 보여줌
        }
    let firstPage = lastPage - (groupSize - 1)<=0?1:lastPage - (groupSize - 1)  // 현재 페이지가 속한 그룹의 첫번째 페이지
  
    let paginationHTML = ``
    if(pageGroup > 1) {
    paginationHTML += `<li class="page-item" onclick="moveToPage(1)"><a class="page-link" href="#">&lt;&lt;</a>
    <li class="page-item" onclick="moveToPage(${page-1})"><a class="page-link" href="#">&lt;</a></li>` 
    }
    for(let i=firstPage; i<=lastPage; i++) {
        paginationHTML += `<li class="page-item ${i===page?"active":""}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
    }
    if(pageGroup < lastGroup) {
    paginationHTML += `<li class="page-item" onclick="moveToPage(${page+1})"><a class="page-link" href="#">&gt;</a></li>
    <li class="page-item" onclick="moveToPage(${totalPages})"><a class="page-link" href="#">&gt;&gt;</a>`
    }
    document.querySelector(".pagination").innerHTML = paginationHTML // 여러개의 class값을 선택하지만 그중 첫번째값만 반환
}

// 페이지 이동
const moveToPage = (pageNum) => {
    console.log("movetopage", pageNum)
    page = pageNum
    getNews()
}
