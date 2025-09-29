

## **Heat Map Integration Handoff for Claude Code**

### **Data Format Required**

const surveyData \= {  
  categories: \[  
    {  
      name: "Brand/Market Position",  
      questions: \[  
        { text: "What is the strength of your brand/market visibility?", score: 4 },  
        { text: "What is your brand position against your competitors?", score: 5 },  
        { text: "How modern and relevant is your current company and brand image?", score: 4 }  
      \]  
    },  
    // ... additional categories with same structure  
  \]  
}

### **Implementation**

The working HTML/CSS code is in the artifact found in the POC Code folder. It requires:

* No external dependencies  
* No database  
* No JavaScript logic (pure HTML/CSS)

### **Integration Point**

Replace the hardcoded HTML question cells with a loop through your `surveyData` structure to generate the cells dynamically. Each cell needs:

* Class: `question-cell score-[N]` where N is 1-5  
* Question text as content  
* Score number in `<span class="score-number">[N]</span>`

### **Color Mapping**

* Score 1: rgb(255, 0, 0\)  
* Score 2: rgb(255, 128, 0\)  
* Score 3: rgb(255, 255, 0\)  
* Score 4: rgb(128, 255, 0\)  
* Score 5: rgb(0, 180, 0\)

