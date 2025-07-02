import {User} from "../models/user.js";
import {faker} from "@faker-js/faker";

const createUser = async(numUsers) => {
    try {
        
        const userPromise = [] ;

        for(let i = 0 ; i < numUsers ; i++){
            const tempUser = User.create({
                name: faker.person.fullName(),
                username: faker.internet.username(),
                bio: faker.lorem.sentence(),
                password: "password",
                avatar: {
                    url: faker.image.avatar(),
                    public_id: faker.system.fileName(),
                },
            });

            userPromise.push(tempUser);
            
        }

        await Promise.all(userPromise);
        console.log(`${numUsers} users created successfully!`);
        process.exit(1);

    } catch (error) {
        console.log("Error creating users:", error);
        process.exit(1);
    }
}

export {createUser};