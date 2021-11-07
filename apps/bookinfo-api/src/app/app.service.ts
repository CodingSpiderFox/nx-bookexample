import { AuthorsService } from '@bookexample/authors';
import { BooksService } from '@bookexample/books';
import { User } from '@bookexample/users';
import { Injectable } from '@nestjs/common';
import { Author, Book, Prisma } from '@prisma/client';
import { BooksOfAuthorsService } from './books-of-authors.service';
import { CreateAutobiographyProcessDto } from './create-autobiography-process-dto';

@Injectable()
export class AppService {
  constructor(
    private authorsService: AuthorsService,
    private booksService: BooksService,
    private booksOfAuthorsService: BooksOfAuthorsService
  ) {}

  async handleCreateAutoBiographyCommand(
    createAutobiographyProcessDto: CreateAutobiographyProcessDto,
    user: User
  ) {
    const author: Author = await this.authorsService.createAuthor({
      firstName: createAutobiographyProcessDto.authorFirstName,
      lastName: createAutobiographyProcessDto.authorLastName,
      birthTimestamp: createAutobiographyProcessDto.authorBirthTimestamp,
      createdAt: new Date(),
      updatedAt: null,
      id: null,
    });

    const book: Book = await this.booksService.createBook({
      id: null,
      price: createAutobiographyProcessDto.bookPrice
        ? new Prisma.Decimal(createAutobiographyProcessDto.bookPrice)
        : null,
      title: createAutobiographyProcessDto.bookTitle,
      createdAt: new Date(),
      updatedAt: null,
      writeStartTimestamp: createAutobiographyProcessDto.writeStartTimestamp,
      publishTimestamp: createAutobiographyProcessDto.publishTimestamp,
    });

    this.booksService.publishBookWithId(book.id);

    const booksOfAuthors = this.booksOfAuthorsService.assignBooksToAuthors(
      [author],
      [book]
    );

    console.log(booksOfAuthors);
  }

  getData(): { message: string } {
    return { message: 'Welcome to bookinfo-api!' };
  }
}
