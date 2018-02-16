// I();
// II();
// III();
// IV();
V();



function I() {
    var a = 'a';

    {
        let b = 'b';
    }

    try {
        console.log(a); // a
        console.log(b);
    } catch (err) {
        console.log(err); // [ReferenceError: b is not defined]
    }
}

function II() {
    var a = 'a';
    var a = 'aa';
    let b = 'b';
    let b = 'bb';

    try {
        console.log(a); // a
        console.log(b);
    } catch (err) {
        console.log(err); // Identifier 'b' has already been declared
    }
}

function III() {
    const nums = [1, 2, 3];
    const chars = ['a', 'b', 'c'];

    console.log([...nums, ...chars]); // ​​​​​[ 1, 2, 3, 'a', 'b', 'c' ]
}

function IV() {
    const person = {
        name: 'ali',
        age: 30,
        interests: 'not interested in anything :('
    };

    const displayPerson = ({
        name = 'no name assigned',
        age = 'no age',
        interests = 'no interest',
        job = 'has no job'
    }) => console.log(name, 'in age', age, job, interests);

    displayPerson(person); // ali in age 30 has no job not interested in anything :(​​​​​
}

function V() {

    const test = i => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(i);
                if (i === 3) {
                    reject(i);
                }
                resolve(i);
            }, 100);
        });
    };

    Promise.all([
            test(1),
            test(2),
            // test(3),
            test(4)
        ]).then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });


}