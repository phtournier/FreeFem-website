function parsetree(data) {
   console.log(data)
  const jdata = JSON.parse(data)
  const examples = jdata.tree.find((element) => element.path == "examples")
  console.log(examples.url)

  function parsesubdir(data) {
   const jdata = JSON.parse(data)
   jdata.tree.forEach(element => {
      console.log(element)
  });
  }

  function parsedir(data) {
   const jdata = JSON.parse(data)
   jdata.tree.forEach(element => {
      HTTPGet(element.url, parsesubdir)
  });
  }

  //HTTPGet(examples.url, parsedir)
}

//HTTPGet('https://api.github.com/repos/FreeFem/FreeFem-sources/git/trees/develop', parsetree)

loadExamplefromGitHub = (name, dir, editor) => {
   function load(data) {
      editor.setValue(data)
      highlightKeyword(editor)
   }

   const url = 'https://raw.githubusercontent.com/FreeFem/FreeFem-sources/example-tags/examples/'+dir+'/'+name
   console.log("load " + dir + "/" + name + "from GitHub");
   document.getElementById('ExampleLinkToGitHub').innerHTML = "<a href='https://github.com/FreeFem/FreeFem-sources/blob/example-tags/examples/"+dir+"/"+name+"' target='_blank'>"+dir+"/"+name+"</a>";
   HTTPGet(url, load)
}

function FocusLinks() {
   //document.getElementById("exampleMain").style.gridTemplateColumns = "350px 2px 1fr 2px 1fr";
}

function UnFocusLinks() {
   //document.getElementById("exampleMain").style.gridTemplateColumns = "350px 2px 1fr 2px 1fr";
}

updateList = (focus) => {
   /*
   const FilteredTags = Tags.filter(function(tag, i) {
      return istagactive[i] == true;
   });
   */
   const SetofTags = FilteredTags;
   var examplesList = document.getElementById('linksContainer')
   examplesList.innerHTML = ""
   all_examples.forEach(function callback(example) {
      const locTags = new Set(example.tags.split(" "));
      var take = false;
      var n = 0;
      /*
      while (n < SetofTags.length && locTags.has(SetofTags[n])) {n++;}
      take = (SetofTags.length == 0) || ((n == SetofTags.length) && locTags.has(SetofTags[n-1]));
      */
      while (n < SetofTags.length) {
         if (locTags.has(SetofTags[n])) {
            take = true;
            break;
         }
         n++;
      }
      /*
      let keyword = document.getElementById("keyword-input").value;
      if (keyword != "") {
         const locKeywords = new Set(example.keywords.split(" "));
         take = take && locKeywords.has(keyword);         
      }
      */
      if (take) {
         examplesList.innerHTML += '<a href="#" title="example.desc" id="'+example.name+'" onclick="loadExamplefromGitHub(\''+example.name+'\',\''+example.dir+'\', editor)"> '+ (focus ? example.dir+'/' : '') + example.name +' </a>'
         /*
         if (focus) {
            example.tags.split(" ").forEach(function callback(value) {
               var button = document.createElement("button");
               button.setAttribute("class", "tag-label");
               button.innerHTML = value;
               examplesList.appendChild(button)
            });
         }
         */
         examplesList.innerHTML += '<br>'
      }
   });
   if (focus) FocusLinks();
   else UnFocusLinks();
}

highlightKeyword = (editor) => {
   editor.doc.getAllMarks().forEach(marker => marker.clear());
   let keyword = document.getElementById("keyword-input").value;
   var cursor = editor.getSearchCursor(keyword);
   console.log(keyword)
   while (cursor.findNext()) {
       editor.markText(
         cursor.from(),
         cursor.to(),
         { className: 'highlight-keyword' }
       );
   }
}

parsetree = (data) => {
   var countall = 0;
   for (var i=0; i<data.length; i++) {
      var count = 0;
      if ("children" in data[i])
         count = parsetree(data[i].children);
      else
         count = TagCount.get(data[i].id);
      data[i].text += ' ('+count+')';
      countall += count;
   }
   return countall;
}
