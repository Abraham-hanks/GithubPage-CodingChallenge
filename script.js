document.addEventListener("DOMContentLoaded", async function(){
    // Handler when the DOM is fully loaded
    let menuIcon = document.querySelector('.header-drop-down svg');
    let searchBox = document.getElementsByClassName('searchBox');
    let searchBoxParent = document.querySelector('.full-search');
    let searchBoxParent2 = document.querySelector('.mobile-search');
    let navbar = document.getElementById("nav-tab");
    let userProfileNav = document.querySelector('.user-profile-nav');
    let userProfileImage = document.querySelector('.hide-profile-image');
    let navbarOffset = navbar.offsetTop;
    let userProfileOffset = userProfileNav.offsetTop;

    window.onscroll = function() {
        let x = window.matchMedia("(min-width: 769px)")
        if (x.matches) {
            if (window.pageYOffset >= navbarOffset) {
                navbar.classList.add("sticky")
            } else {
                navbar.classList.remove("sticky");
            }
        }
        else{
            navbar.classList.remove("sticky");
            if(window.pageYOffset >= userProfileOffset){
                userProfileNav.classList.add("sticky-sm");
            }
            else{
                userProfileNav.classList.remove("sticky-sm");
            }
        }

        if (window.pageYOffset >= 300) {
            userProfileImage.style.opacity = 1;
        }
        else{
            userProfileImage.style.opacity = 0;
        }
    };

    


    menuIcon.addEventListener('click', function (e) {
        let menu = document.querySelector('.header-menu');
        let hasClass = menu.classList.contains('hide');
        if (hasClass) {
            menu.classList.remove('hide')
        }
        else{
            menu.classList.add('hide')
        }
    })

    for (let i = 0; i < searchBox.length; i++) {
        searchBox[i].addEventListener('focus', function(){
            searchBoxParent.classList.add('focus');
            searchBoxParent2.classList.add('focus-sm');
        })
        
        searchBox[i].addEventListener('blur', function(){
            searchBoxParent.classList.remove('focus');
            searchBoxParent2.classList.remove('focus-sm')
        })
    }

    let query = {
        "query": "query{viewer{avatarUrl login name bio following{totalCount} followers{totalCount} repositories(last:20){nodes{name createdAt pushedAt updatedAt description forkCount url isFork viewerHasStarred owner{login} parent{name url forkCount owner{login}} primaryLanguage{ color name}}}}}"
    }
    let response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': 'bearer f6aa*****************971f'
        },
        body: JSON.stringify(query)
    });

    let result = await response.json();
    let data = (result.data.viewer.repositories.nodes)
    renderRepo(data);
});

function renderRepo(data) {
    let parent = document.querySelector('.user-repo')
    
    for (let i = 0; i < data.length; i++) {
        let element = data[i];
        let helper = checksHandler(element)
        let div = document.createElement('div');
        div.classList.add('border-bottom', 'repo', 'd-flex');
        let innerHTML = 
        `<div class="d-9">
            <div class="m-b-4">
                <h3 class="repo-title"><a href="${element.url}">${element.name}</a></h3>
                ${helper.forkFrom ? helper.forkFrom : '<span></span>'}
            </div>
            ${helper.description ? helper.description : '<span></span>'}
            <div class="m-t-8 lfd">
                <span class="language-color" style="background-color: ${element.primaryLanguage.color};"></span>
                <span class="m-r-16"> ${element.primaryLanguage.name}</span>
                ${helper.forkCount ? helper.forkCount : '<span></span>'}
                ${helper.update}
            </div>
        </div>
        <div class="d-3 d-flex flex-direction-col">
            <div class="align-self-flex-end">
                <button class="btn-star"><svg class="octicon octicon-star" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
                    Star
                </button>
            </div>
        </div>`;
    
        div.innerHTML = innerHTML; 
        parent.appendChild(div)
    }

}

function checksHandler(repo){
    let repoData = {}
    let date = new Date;
    let currentYear = date.getFullYear();
    let update = repo.pushedAt.substr(0, 10); 
    let months={'1':'Jan','2':'Feb','3':'Mar','4':'Apr','5':'May','6':'Jun','7':'Jul','8':'Aug','9':'Sep','10':'Oct','11':'Nov','12':'Dec'};
    repoData.update = `Updated on ${months[update.substr(6,1)]} ${update.substr(9,1)} ${currentYear == update.substr(0,4)? '':','+update.substr(0,4)}`;

    if (repo.description) {
        repoData.description =
        `<div class="description">
            <p>${repo.description}</p>
        </div>`;
    }

    if (repo.isFork) {
        repoData.forkFrom = 
        ` <span class="fork">Forked from 
            <a href="${repo.parent.url}" class="muted-link">${repo.parent.owner.login + '/'+repo.parent.name}</a>
        </span>`;

        repoData.forkCount = 
        `<a href="#" class="m-r-16 muted-link"><svg aria-label="fork" class="octicon octicon-repo-forked" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
            ${repo.parent.forkCount}
        </a>`
    }

   return repoData;
}