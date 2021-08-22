class PriorityQueue {
    collection : Element[];
    
    constructor() {
        this.collection = [];
    }

    enqueue(element: Element) {
        if (this.isEmpty()){ 
            this.collection.push(element);
        } else {
            let added = false;
            for (let i = 1; i <= this.collection.length; i++){
                if (element.weightToNode < this.collection[i-1].weightToNode){ 
                this.collection.splice(i-1, 0, element);
                added = true;
                break;
                }
            }
            if (!added){
                this.collection.push(element);
            }
        }
    }

    dequeue() {
        return this.collection.shift();
    }

    isEmpty() {
        return this.collection.length == 0;
    }
}

interface Element {
    targetNode: number;
    weightToNode: number;
}

export default PriorityQueue