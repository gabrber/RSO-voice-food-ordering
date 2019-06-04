import { MongoRepository } from 'typeorm';
import { MenuEntity } from './data/entities';
import { addMenu } from './service_local';
import { getRemoteMenu } from './service_backend';

export const synchronize = async (repo: MongoRepository<MenuEntity>) => {
	try {
		const remoteMenu = await getRemoteMenu();
		console.log(`sychronize: remote = ${remoteMenu}`)
		await addMenu(repo, remoteMenu);
	} catch (err) {
        console.log('Synchronize failed: probably restaurant backend is unreachable')
        console.log(err);
    }
};
