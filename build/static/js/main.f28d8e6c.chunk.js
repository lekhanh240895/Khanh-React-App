(this["webpackJsonpreact-app"]=this["webpackJsonpreact-app"]||[]).push([[0],{82:function(e,t,n){},83:function(e,t,n){},85:function(e,t,n){},86:function(e,t,n){"use strict";n.r(t);n(52);var c,a,r,o,s=n(1),i=n.n(s),l=n(43),d=n.n(l),j=n(22),u=n(5),b=n(17),O=n.n(b),p=n(25),h=n(4),f=n(14),m=n(0),x={NONE:function(e){return e},TITLE:function(e){return Object(f.sortBy)(e,"title")}},g=function(e){var t=e.list,n=e.onRemoveTodo,c=e.onCheckedTodo,a=e.onCheckboxChange,r=e.UserId,o=i.a.useState({sortKey:"NONE",isReversed:!1}),s=Object(h.a)(o,2),l=s[0],d=s[1],j=x[l.sortKey],u=l.isReversed?j(t).reverse():j(t);return Object(m.jsxs)("div",{children:[Object(m.jsxs)("div",{className:"d-flex justify-content-start align-items-center mb-3",children:[Object(m.jsx)("button",{className:"btn btn-success mr-5",type:"button",onClick:function(){return function(e){var t=l.sortKey===e&&!l.isReversed;d({sortKey:e,isReversed:t})}("TITLE")},style:{width:"85%",textTransform:"uppercase",fontSize:"24px",fontWeight:"700"},children:"Title"}),Object(m.jsx)("button",{className:"btn btn-success",style:{width:"15%",textTransform:"uppercase",fontSize:"24px",fontWeight:"700",pointerEvents:"none"},children:"Action"})]}),Object(m.jsxs)("div",{className:"d-flex justify-content-between",children:[Object(m.jsxs)("div",{style:{fontSize:"20px",fontWeight:"600",textTransform:"capitalize",fontStyle:"italic"},children:["User Id: ",r]}),Object(m.jsx)("form",{children:Object(m.jsxs)("div",{className:"form-check",children:[Object(m.jsx)("label",{htmlFor:"markAllTodos",className:"form-check-label",children:Object(m.jsx)("span",{style:{fontSize:"20px",fontWeight:"600",textTransform:"capitalize",fontStyle:"italic",lineHeight:"0.5"},children:"Mark all works"})}),Object(m.jsx)("input",{className:"form-check-input",id:"markAllTodos",type:"checkbox",onChange:function(e){return a(t,e)}})]})})]}),Object(m.jsx)("div",{children:u.map((function(e){return Object(m.jsx)(v,{todo:e,onRemoveTodo:n,onCheckedTodo:c},e.id)}))})]})},v=function(e){var t=e.todo,n=e.onRemoveTodo,c=e.onCheckedTodo;return Object(m.jsxs)("div",{className:"d-flex justify-content-start align-items-center mb-1",children:[Object(m.jsx)("span",{style:{width:"5%"},children:Object(m.jsx)("input",{className:"form-check-input",value:t.title,id:t.id,type:"checkbox",onChange:function(){return c(t)},checked:t.completed})}),Object(m.jsx)("span",{className:"form-check",style:{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",textTransform:"capitalize",width:"80%"},children:Object(m.jsx)("label",{className:"form-check-label",htmlFor:t.id,children:Object(m.jsx)("span",{children:t.title})})}),Object(m.jsx)("span",{style:{width:"15%",textAlign:"center"},children:Object(m.jsx)("button",{className:"btn btn-primary",type:"button",onClick:function(){return n(t)},children:"Delete"})})]})},S=n(7),y=n(8),T=y.a.p(c||(c=Object(S.a)(["\n  text-transform: capitalize;\n  font-size: 20px;\n  font-weight: 600;\n  font-style: italic;\n  margin-top: 1.5rem;\n"]))),w=y.a.label(a||(a=Object(S.a)(["\n  text-transform: capitalize;\n  font-size: 20px;\n  font-weight: 600;\n  padding: 0.5rem 0;\n"]))),N=y.a.form(r||(r=Object(S.a)(["\n  margin: 0.5rem 0;\n"]))),C=(y.a.nav(o||(o=Object(S.a)(["\n  background: inherit;\n  color: #067ded;\n  fontweight: 600;\n  fontsize: 18px;\n"]))),function(e){var t=e.onAddTodoSubmit,n=e.onAddTodoInput;return Object(m.jsxs)(N,{onSubmit:t,className:"form-row",children:[Object(m.jsx)(w,{className:"form-group",htmlFor:"addForm",style:{fontSize:"20px",fontWeight:"600",textTransform:"capitalize"},children:"Add Something:"}),Object(m.jsxs)("div",{className:"row form-group",children:[Object(m.jsx)("div",{className:"col-10",style:{marginRight:"-0.75rem"},children:Object(m.jsx)("input",{className:"form-control",id:"addForm",type:"text",placeholder:"What do you want to do?",onChange:n})}),Object(m.jsx)("div",{className:"col-2",children:Object(m.jsx)("button",{className:"btn btn-primary",type:"submit",children:"Submit"})})]})]})}),k=n(2),E=function(e,t){switch(t.type){case"TODOS_FETCH_INIT":return Object(k.a)(Object(k.a)({},e),{},{isLoading:!0,isError:!1});case"TODOS_FETCH_SUCCESS":return Object(k.a)(Object(k.a)({},e),{},{isLoading:!1,isError:!1,data:1===t.payload.page?t.payload.list:e.data.concat(t.payload.list)});case"TODOS_FETCH_FAILURE":return Object(k.a)(Object(k.a)({},e),{},{isLoading:!1,isError:!0});case"DO_TODO":return Object(k.a)(Object(k.a)({},e),{},{data:e.data.map((function(e){return e.id===t.id?Object(k.a)(Object(k.a)({},e),{},{completed:!0}):e}))});case"UNDO_TODO":return Object(k.a)(Object(k.a)({},e),{},{data:e.data.map((function(e){return e.id===t.id?Object(k.a)(Object(k.a)({},e),{},{completed:!1}):e}))});case"REMOVE_TODO":return Object(k.a)(Object(k.a)({},e),{},{data:e.data.filter((function(e){return e.id!==t.payload.id}))});case"ADD_TODO":return Object(k.a)(Object(k.a)({},e),{},{data:e.data.concat({id:Math.random(),title:t.payload,completed:!1})});case"MARK_ALL_TODOS":return Object(k.a)(Object(k.a)({},e),{},{data:e.data.map((function(e){return Object(k.a)(Object(k.a)({},e),{},{completed:!0})}))});case"UNMARK_ALL_TODOS":return Object(k.a)(Object(k.a)({},e),{},{data:e.data.map((function(e){return Object(k.a)(Object(k.a)({},e),{},{completed:!1})}))});default:return e}},I=n(27),R=n.n(I),_=n(29),A=function(e,t){var n=t-e+1;return Array.from({length:n},(function(t,n){return n+e}))},D=null;var L,M,F=n(28),z=n.n(F),U=n(9),H=y.a.li(L||(L=Object(S.a)(["\n  font-weight: 700;\n  &:hover {\n    cursor: pointer;\n  }\n"]))),K=Object(y.a)(H)(M||(M=Object(S.a)(["\n  &.page-item {\n    &.disabled {\n      pointer-events: none;\n    }\n  }\n"])));function P(e){var t=e.onPageChange,n=e.totalCount,c=e.siblingCount,a=void 0===c?1:c,r=e.currentPage,o=e.pageSize,s=function(e){var t=e.totalCount,n=e.pageSize,c=e.siblingCount,a=void 0===c?1:c,r=e.currentPage;return i.a.useMemo((function(){var e=Math.ceil(t/n);if(a+5>=e)return A(1,e);var c=Math.max(r-a,1),o=Math.min(r+a,e),s=c>2,i=o<e-2,l=1,d=e;if(!s&i){var j=A(1,3+2*a);return[].concat(Object(_.a)(j),[D,e])}if(s&!i){var u=A(e-(3+2*a)+1,e);return[l,D].concat(Object(_.a)(u))}if(s&i){var b=A(c,o);return[l,D].concat(Object(_.a)(b),[D,d])}}),[t,n,a,r])}({totalCount:n,siblingCount:a,currentPage:r,pageSize:o});if(r<=0&s.length<2)return null;var l=s[s.length-1];return Object(m.jsxs)("ul",{className:"pagination justify-content-center mt-4",children:[Object(m.jsx)(K,{className:z()("page-item",{disabled:1===r}),onClick:function(){return t(r-1)},children:Object(m.jsx)("span",{className:"page-link",children:Object(m.jsx)(U.a,{icon:["fas","arrow-left"]})})}),s.map((function(e,n){return e===D?Object(m.jsx)("li",{className:"page-item page-link",children:"\u2026"},Math.random()):Object(m.jsx)(H,{className:z()("page-item",{active:e===r}),onClick:function(){return t(e)},children:Object(m.jsx)("span",{className:"page-link",children:e})},e)})),Object(m.jsx)(K,{className:z()("page-item",{disabled:r===l}),onClick:function(){return t(r+1)},children:Object(m.jsx)("span",{className:"page-link",children:Object(m.jsx)(U.a,{icon:["fas","arrow-right"]})})})]})}n(82);var W,B,Y,V,J,q,G,Q,X,Z=function(e){var t=e.showBelow,n=void 0===t?200:t,c=Object(s.useState)(!1),a=Object(h.a)(c,2),r=a[0],o=a[1];Object(s.useEffect)((function(){return window.addEventListener("scroll",i),function(){window.removeEventListener("scroll",i)}}));var i=function(){!r&&window.scrollY>=n?o(!0):r&&window.scrollY<n&&o(!1)};return Object(m.jsx)(U.a,{icon:["fas","arrow-up"],id:"scrollArrow",className:"bg-primary text-white",onClick:function(){window.scrollTo({top:0,behavior:"smooth"})},style:{display:r?"inline-block":"none"}})},$="https://jsonplaceholder.typicode.com/todos",ee=function(e,t){return"".concat($,"?").concat("userId=").concat(e,"&").concat("_page=").concat(t)},te=function(){var e=Object(s.useReducer)(E,{data:[],isLoading:!1,isError:!1}),t=Object(h.a)(e,2),n=t[0],c=t[1],a=n.data.length,r=Object(s.useState)(0),o=Object(h.a)(r,2),l=o[0],d=o[1],j=Object(s.useState)(""),u=Object(h.a)(j,2),b=u[0],f=u[1],x=Object(s.useState)(1),v=Object(h.a)(x,2),S=v[0],y=v[1],k=function(e,t){var n=Object(s.useState)(localStorage.getItem(e)||t),c=Object(h.a)(n,2),a=c[0],r=c[1];return Object(s.useEffect)((function(){localStorage.setItem(e,a)})),[a,r]}("IdSearch",1),I=Object(h.a)(k,2),_=I[0],A=I[1],D=Object(s.useState)([ee(_,S)]),L=Object(h.a)(D,2),M=L[0],F=L[1],z=Object(s.useState)(!1),U=Object(h.a)(z,2),H=U[0],K=U[1],W=Object(s.useState)(!1),B=Object(h.a)(W,2),Y=B[0],V=B[1],J=Object(s.useCallback)(Object(p.a)(O.a.mark((function e(){var t,n;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c({type:"TODOS_FETCH_INIT"}),e.prev=1,t=M[M.length-1],e.next=5,R.a.get(t);case 5:0===(n=e.sent).data.length?(M.pop(),V(!0)):M[M.length-2]===t&&M.pop(),c({type:"TODOS_FETCH_SUCCESS",payload:{list:n.data,page:S}}),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(1),c({type:"TODOS_FETCH_FAILURE"});case 13:case"end":return e.stop()}}),e,null,[[1,10]])}))),[M]);Object(s.useEffect)((function(){return J()}),[J]);Object(s.useEffect)((function(){d(n.data.filter((function(e){return!1===e.completed})).length)}),[n]);var q=function(e){return e.reduce((function(e,t,n){var c=function(e){return e.substring(e.lastIndexOf("?")+1,e.lastIndexOf("&")).replace("userId=","User Id: ")}(t);return c.includes("User Id")?0===n?e.concat(c):e[e.length-1]===c?e:e.concat(c):e}),[]).slice(-6).slice(0,-1)}(M),G=i.a.useState(S),Q=Object(h.a)(G,2),X=Q[0],te=Q[1],ne=i.a.useMemo((function(){var e=20*(X-1),t=e+20;return n.data.slice(e,t)}),[X,n.data]);return console.log(Y,H),Object(m.jsxs)("div",{children:[Object(m.jsxs)("h1",{children:["My Todo App with ",a," works."]}),Object(m.jsxs)(T,{children:[l," Works uncompleted!"]}),Object(m.jsxs)(N,{className:"form mb-3",onSubmit:function(e){y(1),K(!1);var t=ee(_,1);F(M.concat(t)),e.preventDefault(),V(!1)},children:[Object(m.jsx)(w,{className:"form-group text-capitalize",htmlFor:"IdSearch",children:"Search by UserId:"}),Object(m.jsxs)("div",{className:"row",children:[Object(m.jsx)("div",{className:"col-10",style:{marginRight:"-0.75rem"},children:Object(m.jsx)("input",{id:"IdSearch",className:"form-group form-control",type:"text",placeholder:"Your ID number",autoFocus:!0,onChange:function(e){A(e.target.value)},value:_})}),Object(m.jsx)("div",{className:"col-2",children:Object(m.jsx)("button",{className:"btn btn-primary",children:"Submit"})})]})]}),Object(m.jsx)("div",{children:q.map((function(e,t){return Object(m.jsx)("button",{type:"button",onClick:function(){return function(e){var t=e.replace("User Id: ","");y(1),K(!1);var n=ee(t,1);F(M.concat(n)),A(t),V(!1)}(e)},className:"btn btn-dark",children:e},e+t)}))}),Object(m.jsx)("button",{className:"btn btn-primary mt-3 mb-2",onClick:function(){A("");var e="".concat($);F(M.concat(e)),K(!0),y(1),V(!1)},children:"Show All User's Works"}),Object(m.jsx)(g,{list:H?ne:n.data,onRemoveTodo:function(e){c({type:"REMOVE_TODO",payload:e})},onCheckedTodo:function(e){c({type:e.completed?"UNDO_TODO":"DO_TODO",id:e.id})},onCheckboxChange:function(e,t){return c({type:t.target.checked?"MARK_ALL_TODOS":"UNMARK_ALL_TODOS",payload:e})},UserId:_}),n.isError&&Object(m.jsx)(T,{children:"Oops! Something went wrong"}),n.isLoading?Object(m.jsx)(T,{children:"Loading..."}):!H&!Y?Object(m.jsx)("button",{className:"btn btn-primary",onClick:function(){if(!H){var e=ee(_,S+1);F(M.concat(e))}y(S+1)},children:"More"}):Y?Object(m.jsx)(T,{children:"No more works"}):Object(m.jsx)(P,{onPageChange:function(e){y(e),te(e)},totalCount:n.data.length,currentPage:S,pageSize:20}),Object(m.jsx)(C,{onAddTodoInput:function(e){f(e.target.value)},onAddTodoSubmit:function(e){e.preventDefault(),c({type:"ADD_TODO",payload:b})}}),Object(m.jsx)(Z,{})]})},ne=y.a.div(W||(W=Object(S.a)(["\n  padding-bottom: 20px;\n  display: flex;\n  align-items: center;\n"]))),ce=y.a.span(B||(B=Object(S.a)(["\n  padding-left: 10px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  text-align: center;\n  a {\n    color: inherit;\n  }\n\n  width: ",";\n"])),(function(e){return e.width})),ae=y.a.button(Y||(Y=Object(S.a)(["\n  padding: 5px;\n  border: 1px solid #171212;\n  cursor: pointer;\n  background: transparent;\n  transition: all 0.1s ease-in;\n\n  &:hover {\n    background: #171212;\n    color: #ffff;\n    svg {\n      g {\n        fill: #ffffff;\n        stroke: #ffffff;\n      }\n    }\n  }\n"]))),re=Object(y.a)(ae)(V||(V=Object(S.a)(["\n  padding: 5px;\n"]))),oe=Object(y.a)(ae)(J||(J=Object(S.a)(["\n  padding: 10px;\n"]))),se=y.a.form(q||(q=Object(S.a)(["\n  padding: 10px 0 20px 0;\n  display: flex;\n  align-items: stretch;\n"]))),ie=y.a.label(G||(G=Object(S.a)(["\n  border: 1px solid #171212;\n  border-right: none;\n  font-size: 24px;\n  padding-left: 5px;\n"]))),le=y.a.input(Q||(Q=Object(S.a)(["\n  width: 100%;\n  border: 1px solid #171212;\n  border-right: none;\n  background-color: transparent;\n  font-size: 24px;\n  margin-left: -5px;\n  padding-left: 5px;\n"]))),de=(y.a.nav(X||(X=Object(S.a)(["\n  background: inherit;\n  color: #067ded;\n  fontweight: 600;\n  fontsize: 18px;\n"]))),function(e){var t=e.isFocused,n=e.children,c=e.type,a=void 0===c?"text":c,r=e.id,o=e.value,s=e.onInputChange,l=e.checked,d=i.a.useRef(null);return i.a.useEffect((function(){t&&d.current&&d.current.focus()})),Object(m.jsxs)(m.Fragment,{children:[Object(m.jsxs)(ie,{htmlFor:r,children:[" ",n]}),"\xa0",Object(m.jsx)(le,{id:r,type:a,value:o,onChange:s,ref:d,checked:l})]})}),je=i.a.memo((function(e){var t=e.onSearchSubmit,n=e.onSearchInput,c=e.searchTerm;return Object(m.jsxs)(se,{onSubmit:t,children:[Object(m.jsx)(de,{onInputChange:n,value:c,id:"search",isFocused:!0,children:Object(m.jsx)("strong",{children:"Search for:"})}),Object(m.jsx)(oe,{type:"submit",disabled:!c,children:"Submit"})]})})),ue=n(47),be={NONE:function(e){return e},TITLE:function(e){return Object(f.sortBy)(e,"title")},AUTHOR:function(e){return Object(f.sortBy)(e,"author")},NUM_COMMENTS:function(e){return Object(f.sortBy)(e,"num_comments").reverse()},POINTS:function(e){return Object(f.sortBy)(e,"points").reverse()}},Oe=i.a.memo((function(e){var t=e.list,n=e.onRemoveItem,c=e.onFetchMore,a=(e.page,i.a.useState({sortKey:"NONE",isReversed:!1,isSorted:!1,isShowArrow:!1})),r=Object(h.a)(a,2),o=r[0],s=r[1],l=function(e){var t=e===o.sortKey&&!o.isReversed;s({sortKey:e,isReversed:t,isSorted:!0})},d=be[o.sortKey],j=o.isReversed?d(t).reverse():d(t);return Object(m.jsxs)("div",{children:[Object(m.jsx)("div",{children:Object(m.jsxs)(ne,{children:[Object(m.jsxs)(re,{type:"button",onClick:function(){return l("TITLE")},style:{width:"35%",fontSize:"18px",textTransform:"uppercase",fontWeight:"600"},children:[Object(m.jsx)("span",{className:"p-2",children:"Title"}),o.isSorted&"TITLE"===o.sortKey?o.isReversed?Object(m.jsx)(U.a,{icon:["fas","arrow-down"]}):Object(m.jsx)(U.a,{icon:["fas","arrow-up"]}):null]}),Object(m.jsxs)(re,{type:"button",onClick:function(){return l("AUTHOR")},style:{width:"15%",fontSize:"18px",textTransform:"uppercase",fontWeight:"600"},children:[Object(m.jsx)("span",{className:"p-2",children:"Author"}),o.isSorted&"AUTHOR"===o.sortKey?o.isReversed?Object(m.jsx)(U.a,{icon:["fas","arrow-down"]}):Object(m.jsx)(U.a,{icon:["fas","arrow-up"]}):null]}),Object(m.jsxs)(re,{type:"button",onClick:function(){return l("NUM_COMMENTS")},style:{width:"20%",fontSize:"18px",textTransform:"uppercase",fontWeight:"600"},children:[Object(m.jsx)("span",{className:"p-2",children:"Comments"}),o.isSorted&"NUM_COMMENTS"===o.sortKey?o.isReversed?Object(m.jsx)(U.a,{icon:["fas","arrow-up"]}):Object(m.jsx)(U.a,{icon:["fas","arrow-down"]}):null]}),Object(m.jsxs)(re,{type:"button",onClick:function(){return l("POINTS")},style:{width:"15%",fontSize:"18px",textTransform:"uppercase",fontWeight:"600"},children:[Object(m.jsx)("span",{className:"p-2",children:"Points"}),o.isSorted&"POINTS"===o.sortKey?o.isReversed?Object(m.jsx)(U.a,{icon:["fas","arrow-up"]}):Object(m.jsx)(U.a,{icon:["fas","arrow-down"]}):null]}),Object(m.jsx)(re,{style:{width:"15%",fontSize:"18px",textTransform:"uppercase",fontWeight:"600",cursor:"text"},children:Object(m.jsx)("span",{className:"p-2",children:"Actions"})})]})}),Object(m.jsx)(ue.a,{dataLength:j.length,next:c,hasMore:!0,endMessage:Object(m.jsx)("p",{style:{textAlign:"center"},children:Object(m.jsx)("b",{children:"Yay! You have seen it all"})}),children:j.map((function(e){return Object(m.jsx)(pe,{item:e,onRemoveItem:n},e.objectID)}))})]})})),pe=i.a.memo((function(e){var t=e.item,n=e.onRemoveItem;return Object(m.jsxs)(ne,{children:[Object(m.jsx)(ce,{style:{textAlign:"left",width:"35%"},children:Object(m.jsx)("a",{href:t.url,children:t.title})}),Object(m.jsx)(ce,{style:{textTransform:"capitalize",width:"15%"},children:t.author}),Object(m.jsx)(ce,{width:"20%",children:t.num_comments}),Object(m.jsx)(ce,{width:"15%",children:t.points}),Object(m.jsx)(ce,{width:"15%",children:Object(m.jsx)(re,{type:"button",onClick:function(){return n(t)},children:Object(m.jsx)(U.a,{icon:["fas","check"],size:"sm"})})})]})})),he=function(e){var t=e.lastSearchs,n=e.onLastSearch;return Object(m.jsx)("div",{style:{marginBottom:"20px"},children:t.map((function(e,t){return Object(m.jsx)("button",{type:"button",onClick:function(){return n(e)},children:e},e+t)}))})},fe=function(e,t){switch(t.type){case"STORIES_FETCH_INIT":return Object(k.a)(Object(k.a)({},e),{},{isLoading:!0,isError:!1});case"STORIES_FETCH_SUCCESS":return Object(k.a)(Object(k.a)({},e),{},{isLoading:!1,isError:!1,data:0===t.payload.page?t.payload.list:e.data.concat(t.payload.list),page:t.payload.page});case"STORIES_FETCH_FAILURE":return Object(k.a)(Object(k.a)({},e),{},{isLoading:!1,isError:!0});case"REMOVE_STORY":return Object(k.a)(Object(k.a)({},e),{},{data:e.data.filter((function(e){return e.objectID!==t.payload.objectID}))});default:throw new Error}},me="query=",xe=function(e,t){return"".concat("https://hn.algolia.com/api/v1").concat("/search","?").concat(me).concat(e,"&").concat("page=").concat(t,"&").concat("hitsPerPage=").concat(15)},ge=function(e){return e.substring(e.lastIndexOf("?")+1,e.indexOf("&")).replace(me,"")},ve=function(){var e=Object(s.useReducer)(fe,{data:[],isLoading:!1,isError:!1,page:0}),t=Object(h.a)(e,2),n=t[0],c=t[1],a=function(e,t){var n=i.a.useState(localStorage.getItem(e)||t),c=Object(h.a)(n,2),a=c[0],r=c[1],o=i.a.useRef(!1);return i.a.useEffect((function(){o.current?localStorage.setItem(e,a):o.current=!0}),[e,a]),[a,r]}("search","React"),r=Object(h.a)(a,2),o=r[0],l=r[1],d=Object(s.useState)([xe(o,0)]),j=Object(h.a)(d,2),u=j[0],b=j[1],f=function(e){return e.reduce((function(e,t,n){var c=ge(t);return 0===n?e.concat(c):e[e.length-1]===c?e:e.concat(c)}),[]).slice(-6).slice(0,-1)}(u),x=Object(s.useCallback)(Object(p.a)(O.a.mark((function e(){var t,n;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c({type:"STORIES_FETCH_INIT"}),e.prev=1,t=u[u.length-1],e.next=5,R.a.get(t);case 5:n=e.sent,c({type:"STORIES_FETCH_SUCCESS",payload:{list:n.data.hits,page:n.data.page}}),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(1),c({type:"STORIES_FETCH_FAILURE"});case 12:case"end":return e.stop()}}),e,null,[[1,9]])}))),[u]);Object(s.useEffect)((function(){x()}),[x]);var g=Object(s.useCallback)((function(e){c({type:"REMOVE_STORY",payload:e})}),[]),v=Object(s.useCallback)((function(e){return l(e.target.value)}),[l]),S=function(e,t){var n=xe(e,t);b(u.concat(n))},y=Object(s.useMemo)((function(){return function(e){return e.data.reduce((function(e,t){return e+t.num_comments}),0)}(n)}),[n]);return Object(m.jsxs)("div",{children:[Object(m.jsxs)("h1",{children:["My Hacker Stories with ",y," comments"]}),Object(m.jsx)(je,{searchTerm:o,onSearchSubmit:function(e){S(o,0),e.preventDefault()},onSearchInput:v}),Object(m.jsx)(he,{lastSearchs:f,onLastSearch:function(e){S(e,0),l(e)}}),Object(m.jsx)(Oe,{list:n.data,onRemoveItem:g,onFetchMore:function(){var e=u[u.length-1],t=ge(e);S(t,n.page+1)},page:n.page}),n.isError&&Object(m.jsx)("p",{children:Object(m.jsx)("strong",{children:"Oops! Something went wrong..."})}),n.isLoading?Object(m.jsx)("p",{children:Object(m.jsx)("strong",{children:"Loading..."})}):Object(m.jsx)("p",{children:"Scroll down to see more stories"})]})},Se=function(){return Object(m.jsx)("div",{children:Object(m.jsx)("h1",{children:"My App"})})},ye=n(15),Te=n(50),we=n(49),Ne=n(48);ye.b.add(Ne.a,we.a,Te.a);n(83);var Ce=function(){return Object(m.jsxs)(j.a,{children:[Object(m.jsx)("nav",{className:"navbar navbar-expands-sm d-flex justify-content-end ",children:Object(m.jsxs)("ul",{className:"nav",children:[Object(m.jsx)("li",{className:"nav-item",children:Object(m.jsx)(j.b,{to:"/",style:{textDecoration:"none"},children:Object(m.jsx)("span",{className:"nav-link",children:"Home"})})}),Object(m.jsx)("li",{className:"nav-item",children:Object(m.jsx)(j.b,{to:"/todo-app",style:{textDecoration:"none"},children:Object(m.jsx)("span",{className:"nav-link",children:"Todo App"})})}),Object(m.jsx)("li",{className:"nav-item",children:Object(m.jsx)(j.b,{to:"/stories-app",style:{textDecoration:"none"},children:Object(m.jsx)("span",{className:"nav-link",children:"Hacker News Stories App"})})})]})}),Object(m.jsx)("div",{className:"container-fluid",children:Object(m.jsxs)(u.c,{children:[Object(m.jsx)(u.a,{path:"/todo-app",children:Object(m.jsx)(te,{})}),Object(m.jsx)(u.a,{path:"/stories-app",children:Object(m.jsx)(ve,{})}),Object(m.jsx)(u.a,{path:"/",children:Object(m.jsx)(Se,{})})]})})]})},ke=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,87)).then((function(t){var n=t.getCLS,c=t.getFID,a=t.getFCP,r=t.getLCP,o=t.getTTFB;n(e),c(e),a(e),r(e),o(e)}))};n(85);d.a.render(Object(m.jsxs)(i.a.StrictMode,{children:[Object(m.jsx)(Ce,{}),","]}),document.getElementById("root")),ke()}},[[86,1,2]]]);
//# sourceMappingURL=main.f28d8e6c.chunk.js.map