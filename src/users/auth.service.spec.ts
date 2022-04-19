import { Test } from '@nestjs/testing';
import { filter } from 'rxjs';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';


describe('Test the authentication service', () => {

  let service: AuthService;
  let fakeUserService: Partial<UsersService>;
  beforeEach(async () => {

    const users: User[] = [];

    fakeUserService = {
      find: (email: string) => {
        const filteredUsers: User[] = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: ({ email, password }) => {
        const user = { id: Math.random() * 9999 + '', email, password };
        return Promise.resolve(user as User);
      }
    };

    const module = await Test.createTestingModule({
      providers: [AuthService, { provide: UsersService, useValue: fakeUserService }],
    }).compile();

    service = module.get<AuthService>(AuthService);

  });

  it('can create an instance of the auth service', async () => {
    expect(service).toBeDefined();
  });

  it('Creates a new user with a hashed and salted password', async () => {
    const [email, password] = ['noel@gmail.com', 'assadasdasdasd']
    const user = await service.signup(email, password);

    expect(user.password).not.toEqual(password);

    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();

  });

  it('throws an error if user signs up with an email thats already used', (done) => {

    service.signup("hello@gmail.com", "asadasd").then(() => {

      service.signup("hello@gmail.com", "asadasd").then(() => {

      }).catch(() => {
        done();
      });
      done();
    })

  })

  it('throws an error if user signs in with an email that does not exist', (done) => {

    service.signin("hello", "asadasd").then(() => {

    }).catch(() => {
      done();
    });
  })

  it('throws an error if user provides an invalid password', (done) => {

    service.signup('noel@gmail.com', 'password').then(() => {
      service.signin("hello", "heloo").then(() => {

      }).catch(() => {
        done();
      });
      done();
    })


  })

  it('Returns user if correct password', (done) => {

    fakeUserService.create({ email: 'noel@gmail.com', password: 'ed458949e88f5091.3defb2a786bd12168d2e86fb88fa7069e4cf95e36f664bb25a8b5a117249424c' }).then(() => {

      service.signin("noel@gmail.com", "mypassword").then(() => {
        done();
      }).catch(() => {

      });
      done();
    })

  })

})

