#General description
Library which allows to work with strings as with streams. Allows to write parsers, tokenizers etc.

#API
..tbd

#Example
Pseudo-code of writing html-parser
```Javascript

    function readNode () {
      var childs = [];
      var tag = stream.readNext('<');
      var tagName = stream.readNextWord();
      stream.startRecording();
      var endTag = stream.readNext('>');
      var nodeTemplate = stream.stopRecording();
      while (true) {
          stream.startRecording();
          stream.readNext('<');
          var textNode = stream.stopRecording();
          if (textNode.trim().length > 0) {
              childs.push({type: 'text', template: textNode});
          }
          if (stream.next() === '/') {
              break;
          } else {
              stream.moveBack(2);
              childs.push(readNode());
          }
      }
      var resp = {tagName: tagName, template: nodeTemplate, children: childs};
      return resp;
     }
    
     var nodes = [];
     while (!stream.isCompleted()) {
      nodes.push(readNode());
     }

```